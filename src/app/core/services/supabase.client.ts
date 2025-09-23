import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseClientService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  /**
   * Obtener el cliente de Supabase
   */
  get client(): SupabaseClient {
    return this.supabase;
  }

  /**
   * Acceso directo a Auth
   */
  get auth() {
    return this.supabase.auth;
  }

  /**
   * Acceso directo a Storage
   */
  get storage() {
    return this.supabase.storage;
  }

  /**
   * Acceso directo a Database
   */
  get database() {
    return this.supabase;
  }

  /**
   * Verificar conexión
   */
  async isConnected(): Promise<boolean> {
    try {
      const { error } = await this.supabase.auth.getSession();
      return !error;
    } catch {
      return false;
    }
  }
}