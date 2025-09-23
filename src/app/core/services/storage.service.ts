import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { SupabaseClientService } from './supabase.client';

export interface UploadResult {
  path: string;
  publicUrl: string;
  fullPath: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  bucket: string;
  path: string;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private supabase: SupabaseClient;
  private uploadProgressSubject = new BehaviorSubject<UploadProgress | null>(null);
  
  // Observables públicos
  public uploadProgress$ = this.uploadProgressSubject.asObservable();

  // Buckets predefinidos
  public readonly BUCKETS = {
    AVATARS: 'avatars',
    DOCUMENTS: 'documents',
    IMAGES: 'images',
    PUBLIC: 'public',
    PRIVATE: 'private'
  } as const;

  constructor(private supabaseClient: SupabaseClientService) {
    this.supabase = this.supabaseClient.client;
    
    // Inicialización automática
    this.initializeStorage();
  }

  /**
   * Inicializar buckets automáticamente si no existen
   */
  private async initializeStorage(): Promise<void> {
    try {
      await this.ensureBucketsExist();
    } catch (error) {
      console.warn('Storage initialization warning:', error);
    }
  }

  /**
   * Verificar y crear buckets si no existen
   */
  private async ensureBucketsExist(): Promise<void> {
    const bucketsToCreate = [
      { name: this.BUCKETS.AVATARS, isPublic: true },
      { name: this.BUCKETS.IMAGES, isPublic: true },
      { name: this.BUCKETS.PUBLIC, isPublic: true },
      { name: this.BUCKETS.DOCUMENTS, isPublic: false },
      { name: this.BUCKETS.PRIVATE, isPublic: false }
    ];

    for (const bucket of bucketsToCreate) {
      try {
        await this.getBucket(bucket.name);
      } catch (error) {
        // Si el bucket no existe, créalo
        try {
          await this.createBucket(bucket.name, bucket.isPublic);
          console.log(`Bucket '${bucket.name}' created successfully`);
        } catch (createError) {
          console.warn(`Could not create bucket '${bucket.name}':`, createError);
        }
      }
    }
  }

  /**
   * Subir un archivo a Supabase Storage
   * @param file - Archivo a subir
   * @param bucket - Bucket de destino
   * @param path - Ruta dentro del bucket
   * @param options - Opciones adicionales
   */
  async uploadFile(
    file: File, 
    bucket: string, 
    path: string,
    options?: {
      cacheControl?: string;
      contentType?: string;
      upsert?: boolean;
    }
  ): Promise<UploadResult> {
    try {
      // Validaciones
      if (!file) {
        throw new Error('No file provided');
      }

      if (!this.isValidFileType(file)) {
        throw new Error('Invalid file type');
      }

      if (!this.isValidFileSize(file)) {
        throw new Error('File size too large');
      }

      // Configurar opciones por defecto
      const uploadOptions = {
        cacheControl: '3600',
        upsert: options?.upsert ?? false,
        contentType: options?.contentType ?? file.type,
        ...options
      };

      // Subir archivo
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(path, file, uploadOptions);

      if (error) {
        throw error;
      }

      // Obtener URL pública
      const publicUrl = this.getPublicUrl(bucket, path);

      return {
        path: data.path,
        publicUrl,
        fullPath: `${bucket}/${data.path}`
      };

    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  /**
   * Subir imagen con redimensionamiento automático
   */
  async uploadImage(
    file: File,
    bucket: string,
    path: string,
    maxWidth?: number,
    maxHeight?: number
  ): Promise<UploadResult> {
    try {
      // Redimensionar imagen si es necesario
      const processedFile = await this.resizeImage(file, maxWidth, maxHeight);
      
      return await this.uploadFile(processedFile, bucket, path, {
        contentType: 'image/jpeg',
        cacheControl: '31536000' // 1 año
      });
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  }

  /**
   * Subir avatar de usuario
   */
  async uploadAvatar(file: File, userId: string): Promise<UploadResult> {
    const path = `${userId}/avatar.${this.getFileExtension(file)}`;
    
    return await this.uploadImage(
      file, 
      this.BUCKETS.AVATARS, 
      path,
      300, // max width
      300  // max height
    );
  }

  /**
   * Obtener URL pública de un archivo
   */
  getPublicUrl(bucket: string, path: string): string {
    const { data } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }

  /**
   * Obtener URL firmada (para archivos privados)
   */
  async getSignedUrl(
    bucket: string, 
    path: string, 
    expiresIn: number = 3600 // 1 hora por defecto
  ): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      throw error;
    }

    return data.signedUrl;
  }

  /**
   * Descargar archivo
   */
  async downloadFile(bucket: string, path: string): Promise<Blob> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .download(path);

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Eliminar archivo
   */
  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw error;
    }
  }

  /**
   * Eliminar múltiples archivos
   */
  async deleteFiles(bucket: string, paths: string[]): Promise<void> {
    const { error } = await this.supabase.storage
      .from(bucket)
      .remove(paths);

    if (error) {
      throw error;
    }
  }

  /**
   * Listar archivos en un bucket
   */
  async listFiles(
    bucket: string, 
    path?: string, 
    options?: {
      limit?: number;
      offset?: number;
      sortBy?: { column: string; order: 'asc' | 'desc' };
    }
  ): Promise<FileMetadata[]> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .list(path, options);

    if (error) {
      throw error;
    }

    return data.map(file => ({
      name: file.name,
      size: file.metadata?.['size'] || 0,
      type: file.metadata?.['mimetype'] || '',
      lastModified: new Date(file.updated_at).getTime(),
      bucket,
      path: path ? `${path}/${file.name}` : file.name
    }));
  }

  /**
   * Crear bucket
   */
  async createBucket(name: string, isPublic: boolean = false): Promise<void> {
    const { error } = await this.supabase.storage
      .createBucket(name, { public: isPublic });

    if (error) {
      throw error;
    }
  }

  /**
   * Obtener información de un bucket
   */
  async getBucket(name: string) {
    const { data, error } = await this.supabase.storage
      .getBucket(name);

    if (error) {
      throw error;
    }

    return data;
  }

  // Métodos de validación y utilidades privadas

  private isValidFileType(file: File): boolean {
    const allowedTypes = [
      'image/jpeg',
      'image/png', 
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    return allowedTypes.includes(file.type);
  }

  private isValidFileSize(file: File, maxSize: number = 10 * 1024 * 1024): boolean {
    return file.size <= maxSize; // 10MB por defecto
  }

  private getFileExtension(file: File): string {
    return file.name.split('.').pop()?.toLowerCase() || '';
  }

  private async resizeImage(
    file: File, 
    maxWidth: number = 800, 
    maxHeight: number = 600
  ): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calcular nuevas dimensiones
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        // Redimensionar
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a Blob y luego a File
        canvas.toBlob((blob) => {
          const resizedFile = new File([blob!], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve(resizedFile);
        }, 'image/jpeg', 0.9);
      };

      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Obtener metadata de un archivo
   */
  async getFileInfo(bucket: string, path: string) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .list(path.split('/').slice(0, -1).join('/'), {
        search: path.split('/').pop()
      });

    if (error) {
      throw error;
    }

    return data[0];
  }

  /**
   * Copiar archivo
   */
  async copyFile(
    fromBucket: string, 
    fromPath: string, 
    toBucket: string, 
    toPath: string
  ): Promise<void> {
    const { error } = await this.supabase.storage
      .from(fromBucket)
      .copy(fromPath, toPath, { destinationBucket: toBucket });

    if (error) {
      throw error;
    }
  }

  /**
   * Mover archivo
   */
  async moveFile(
    fromBucket: string, 
    fromPath: string, 
    toBucket: string, 
    toPath: string
  ): Promise<void> {
    const { error } = await this.supabase.storage
      .from(fromBucket)
      .move(fromPath, toPath, { destinationBucket: toBucket });

    if (error) {
      throw error;
    }
  }

  // =================== MÉTODOS DE CONVENIENCIA (PLUG & PLAY) ===================

  /**
   * Upload rápido para cualquier archivo
   * Detecta automáticamente el bucket apropiado
   */
  async quickUpload(file: File, userId?: string): Promise<UploadResult> {
    const bucket = this.getBucketForFileType(file.type);
    const path = this.generatePath(file, userId);
    
    if (file.type.startsWith('image/')) {
      return await this.uploadImage(file, bucket, path, 800, 600);
    }
    
    return await this.uploadFile(file, bucket, path);
  }

  /**
   * Upload de perfil súper simple
   */
  async uploadProfileImage(file: File, userId: string): Promise<string> {
    const result = await this.uploadAvatar(file, userId);
    return result.publicUrl;
  }

  /**
   * Upload de documento simple
   */
  async uploadDocument(file: File, userId: string): Promise<string> {
    const path = `${userId}/${Date.now()}_${file.name}`;
    const result = await this.uploadFile(file, this.BUCKETS.DOCUMENTS, path);
    return result.publicUrl;
  }

  /**
   * Obtener todas las imágenes de un usuario
   */
  async getUserImages(userId: string): Promise<string[]> {
    try {
      const files = await this.listFiles(this.BUCKETS.IMAGES, userId);
      return files.map(file => this.getPublicUrl(this.BUCKETS.IMAGES, file.path));
    } catch (error) {
      console.error('Error getting user images:', error);
      return [];
    }
  }

  /**
   * Eliminar avatar de usuario
   */
  async deleteUserAvatar(userId: string): Promise<void> {
    const files = await this.listFiles(this.BUCKETS.AVATARS, userId);
    if (files.length > 0) {
      const paths = files.map(f => f.path);
      await this.deleteFiles(this.BUCKETS.AVATARS, paths);
    }
  }

  // =================== MÉTODOS PRIVADOS DE UTILIDAD ===================

  /**
   * Determinar bucket apropiado según tipo de archivo
   */
  private getBucketForFileType(mimeType: string): string {
    if (mimeType.startsWith('image/')) {
      return this.BUCKETS.IMAGES;
    }
    
    if (mimeType === 'application/pdf' || 
        mimeType.includes('document') || 
        mimeType.includes('text')) {
      return this.BUCKETS.DOCUMENTS;
    }
    
    return this.BUCKETS.PRIVATE;
  }

  /**
   * Generar path automático para archivo
   */
  private generatePath(file: File, userId?: string): string {
    const timestamp = Date.now();
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    if (userId) {
      return `${userId}/${timestamp}_${cleanName}`;
    }
    
    return `${timestamp}_${cleanName}`;
  }

  /**
   * Verificar si el servicio está listo
   */
  async isReady(): Promise<boolean> {
    try {
      // Verificar conexión listando buckets
      const { data, error } = await this.supabase.storage.listBuckets();
      return !error && data.length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Obtener estadísticas de uso
   */
  async getUsageStats(userId: string): Promise<{
    totalFiles: number;
    totalSize: number;
    bucketStats: { [bucket: string]: { files: number; size: number } };
  }> {
    const stats = {
      totalFiles: 0,
      totalSize: 0,
      bucketStats: {} as { [bucket: string]: { files: number; size: number } }
    };

    for (const bucket of Object.values(this.BUCKETS)) {
      try {
        const files = await this.listFiles(bucket, userId);
        const bucketStats = {
          files: files.length,
          size: files.reduce((total, file) => total + file.size, 0)
        };
        
        stats.bucketStats[bucket] = bucketStats;
        stats.totalFiles += bucketStats.files;
        stats.totalSize += bucketStats.size;
      } catch (error) {
        stats.bucketStats[bucket] = { files: 0, size: 0 };
      }
    }

    return stats;
  }
}