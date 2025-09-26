import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseClientService } from './supabase.client';
import { BehaviorSubject } from 'rxjs';

export interface EstadoAuth {
  estaAutenticado: boolean;
  usuarioId: string | null;
  session: any | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private estadoAuthSubject = new BehaviorSubject<EstadoAuth>({
    estaAutenticado: false,
    usuarioId: null,
    session: null
  });
  
  // Observable público para que otros servicios se suscriban
  public estadoAuth$ = this.estadoAuthSubject.asObservable();
  private inicializado = false;

  constructor(public supabaseClient: SupabaseClientService) {
    this.supabase = this.supabaseClient.client;
    this.inicializarAuth();
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  private async inicializarAuth(): Promise<void> {
    if (this.inicializado) return;

    // Escuchar cambios de autenticación
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      const nuevoEstado: EstadoAuth = {
        estaAutenticado: !!session,
        usuarioId: session?.user?.id || null,
        session: session
      };
      
      this.estadoAuthSubject.next(nuevoEstado);
    });

    // Verificar sesión actual
    const { data: { session } } = await this.supabase.auth.getSession();
    const estadoActual: EstadoAuth = {
      estaAutenticado: !!session,
      usuarioId: session?.user?.id || null,
      session: session
    };
    
    this.estadoAuthSubject.next(estadoActual);
    this.inicializado = true;
  }

  /**
   * Obtener el estado actual de autenticación
   */
  obtenerEstadoActual(): EstadoAuth {
    return this.estadoAuthSubject.value;
  }

  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  async signUp(email: string, password: string) {
    return await this.supabase.auth.signUp({ email, password });
  }

  async signOut() {
    return await this.supabase.auth.signOut();
  }
}