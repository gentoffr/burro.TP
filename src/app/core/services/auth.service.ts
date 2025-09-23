import { SupabaseClient } from '@supabase/supabase-js';
import { Injectable } from '@angular/core';
import { SupabaseClientService } from './supabase.client';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;

  constructor(private supabaseClient: SupabaseClientService) {
    this.supabase = this.supabaseClient.client;
  }
    // Métodos de autenticación usando this.supabase.auth
    async signIn(email: string, password: string): Promise<void> {
      const { error } = await this.supabase.auth.signInWithPassword({ email, password });
      if (error) {
        throw error;
        //comentario
      }
    }

}