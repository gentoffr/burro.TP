import { Injectable } from '@angular/core';
import { perfil } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardRoutingService {

  constructor() { }

  /**
   * Obtiene la ruta del dashboard según el perfil del usuario
   * @param userPerfil Perfil del usuario
   * @returns Ruta del dashboard correspondiente
   */
  getDashboardRoute(userPerfil: perfil): string {
    switch (userPerfil) {
      case perfil.Duenio:
        return '/dash-duenio';
      case perfil.Supervisor:
        return '/dashboard/supervisor';
      case perfil.Maitre:
        return '/dashboard/maitre';
      case perfil.Mozo:
        return '/dashboard/mozo';
      case perfil.Cocinero:
        return '/dashboard/cocinero';
      case perfil.Bartender:
        return '/dashboard/bartender';
      case perfil.ClienteRegistrado:
        return '/dashboard/cliente';
      case perfil.ClienteAnonimo:
        return '/menu'; // Los anónimos van directo al menú
      default:
        return '/dashboard/duenio'; // Fallback por defecto
    }
  }

  /**
   * Verifica si un perfil tiene acceso a un dashboard específico
   * @param userPerfil Perfil del usuario
   * @param dashboardPath Ruta del dashboard
   * @returns true si tiene acceso, false si no
   */
  hasAccessToDashboard(userPerfil: perfil, dashboardPath: string): boolean {
    const allowedRoute = this.getDashboardRoute(userPerfil);
    return dashboardPath.includes(allowedRoute.split('/').pop() || '');
  }
}