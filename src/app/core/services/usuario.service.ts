import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { Usuario, perfil } from '../models/usuario.model';

// Interface para registro
@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  // Estado de sesión
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  // Observables públicos
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private authService: AuthService) {
    // NO inicializamos aquí - el AuthService ya se inicializa automáticamente
    this.suscribirseAEstadoAuth();
  }

  /**
   * Suscribirse a los cambios de estado de autenticación del AuthService
   */
  private suscribirseAEstadoAuth(): void {
    this.authService.estadoAuth$.subscribe(async (estadoAuth) => {
      if (estadoAuth.estaAutenticado && estadoAuth.usuarioId) {
        // Usuario se autenticó - cargar perfil
        await this.loadUserProfile(estadoAuth.usuarioId);
      } else {
        // Usuario se desautenticó - limpiar estado
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
      }
    });
  }

  /**
   * Iniciar sesión - usa AuthService y construye Usuario
   */
  async signIn(email: string, password: string): Promise<Usuario> {
    console.log('[USUARIO-SERVICE] Iniciando signIn con email:', email);
    
    try {
      const { data, error } = await this.authService.signIn(
        email,
        password,
      );
      console.log('[USUARIO-SERVICE] Respuesta de authService:', JSON.stringify({ 
        hasData: !!data, 
        hasUser: !!data?.user, 
        userId: data?.user?.id,
        hasError: !!error,
        errorMessage: error?.message 
      }));

      if (error) {
        console.error('[USUARIO-SERVICE] Error de autenticación:', error);
        throw error;
      }
      
      if (!data.user) {
        console.error('[USUARIO-SERVICE] No se retornó usuario');
        throw new Error('No user returned');
      }

      console.log('[USUARIO-SERVICE] Usuario autenticado, cargando perfil para ID:', data.user.id);
      
      // Cargar el perfil de forma determinística usando el id retornado
      await this.loadUserProfile(data.user.id);

      const currentUser = this.currentUserSubject.value;
      console.log('[USUARIO-SERVICE] Usuario cargado:', JSON.stringify({
        hasUser: !!currentUser,
        id: currentUser?.id,
        nombre: currentUser?.nombre,
        perfil: currentUser?.perfil
      }));
      
      if (!currentUser) {
        console.error('[USUARIO-SERVICE] Fallo al cargar perfil de usuario');
        throw new Error('Failed to load user profile');
      }

      console.log('[USUARIO-SERVICE] SignIn exitoso');
      return currentUser;
    } catch (error) {
      console.error('[USUARIO-SERVICE] Error en signIn:', error);
      throw error;
    }
  }

  /**
   * Registrar usuario - usa AuthService y crea perfil
   */
  async signUp(userData: Usuario, password: string): Promise<Usuario> {
    // 1. Registrar en auth usando AuthService
    const { data, error } = await this.authService.supabaseClient.auth.admin.createUser({
      email: userData.email,
      password: password,
      email_confirm: true
    });

    if (error) throw new Error("soy gay");
    if (!data.user) throw new Error('No user returned from signup');

    // 2. Crear perfil en public.profiles
    const usuario = await this.crearPerfil({
      id: data.user.id,
      email: userData.email,
      nombre: userData.nombre,
      apellido: userData.apellido,
      documento: userData.documento,
      perfil: userData.perfil,
      foto_url: userData.foto_url
    });
    return usuario;
  }

  /**
   * Cerrar sesión - usa AuthService
   */
  async signOut(): Promise<void> {
    const { error } = await this.authService.signOut();
    if (error) throw error;
    // El estado se limpia automáticamente por onAuthStateChange
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verificar si está autenticado
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // =================== MÉTODOS PRIVADOS ===================

  /**
   * Cargar perfil del usuario desde public.profiles
   */
  private async loadUserProfile(userId: string): Promise<void> {
    console.log('[USUARIO-SERVICE] Cargando perfil para usuario ID:', userId);
    
    try {
      const { data, error } = await this.authService.client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('[USUARIO-SERVICE] Respuesta de profiles:', JSON.stringify({
        hasData: !!data,
        hasError: !!error,
        errorMessage: error?.message,
        userEmail: data?.email,
        userPerfil: data?.perfil
      }));

      if (error) {
        console.error('[USUARIO-SERVICE] Error loading profile:', error);
        throw new Error('Error loading profile: ' + error.message);
      }

      if (!data) {
        console.error('[USUARIO-SERVICE] No se encontró perfil para el usuario');
        throw new Error('User profile not found');
      }

      console.log('[USUARIO-SERVICE] Creando usuario desde datos de Supabase...');
      const usuario = Usuario.fromSupabase(data);
      console.log('[USUARIO-SERVICE] Usuario creado:', JSON.stringify({
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        perfil: usuario.perfil
      }));
      
      this.currentUserSubject.next(usuario);
      this.isAuthenticatedSubject.next(true);
      
      console.log('[USUARIO-SERVICE] Estado actualizado correctamente');
      
    } catch (error) {
      console.error('[USUARIO-SERVICE] Error in loadUserProfile:', error);
      throw error; // Re-lanzar el error para que se propague
    }
  }

  /**
   * Crear perfil de usuario en public.profiles
   */
  private async crearPerfil(userData: {
    id: string;
    email: string;
    nombre: string;
    apellido: string;
    documento: number;
    perfil?: perfil;
    foto_url?: string;
  }): Promise<Usuario> {
    const profileData = {
      ...userData,
      perfil: userData.perfil,
      foto_url: userData.foto_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await this.authService.client
      .from('profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) throw new Error('Error creating profile: ' + error.message + error.details);
    return Usuario.fromSupabase(data);
  }
}
