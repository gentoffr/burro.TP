import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { Usuario, perfil } from '../models/usuario.model';

// Interface para registro
export interface RegisterData {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  documento: string;
}

@Injectable({
  providedIn: 'root'
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
    const { data, error } = await this.authService.signIn(email, password);

    if (error) throw error;
    if (!data.user) throw new Error('No user returned');

    // Cargar el perfil de forma determinística usando el id retornado
    await this.loadUserProfile(data.user.id);

    const currentUser = this.currentUserSubject.value;
    if (!currentUser) throw new Error('Failed to load user profile');

    return currentUser;
  }

  /**
   * Registrar usuario - usa AuthService y crea perfil
   */
  async signUp(userData: RegisterData): Promise<Usuario> {
    // 1. Registrar en auth usando AuthService
    const { data, error } = await this.authService.signUp(userData.email, userData.password);

    if (error) throw error;
    if (!data.user) throw new Error('No user returned from signup');

    // 2. Crear perfil en public.profiles
    const usuario = await this.crearPerfil({
      id: data.user.id,
      email: userData.email,
      nombre: userData.nombre,
      apellido: userData.apellido,
      documento: userData.documento,
      perfil: perfil.ClienteRegistrado
    });

    // 3. Establecer usuario actual
    this.currentUserSubject.next(usuario);
    this.isAuthenticatedSubject.next(true);

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
    try {
      const { data, error } = await this.authService.client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      const usuario = Usuario.fromSupabase(data);
      this.currentUserSubject.next(usuario);
      this.isAuthenticatedSubject.next(true);
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
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
    documento: string;
    perfil?: perfil;
  }): Promise<Usuario> {
    const profileData = {
      ...userData,
      perfil: userData.perfil || perfil.ClienteRegistrado,
      foto_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await this.authService.client
      .from('profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) throw error;
    return Usuario.fromSupabase(data);
  }
}