import { Injectable } from '@angular/core';
import { perfil } from '../models/usuario.model';
import { DASHBOARD_CONFIG } from '../../features/dashboards/dashboard.routes';

@Injectable({
  providedIn: 'root'
})
export class DashboardRoutingService {

  constructor() { }

  /**
   * Obtiene la ruta del dashboard según el perfil del usuario
   * Ahora usa la configuración centralizada de rutas
   * @param userPerfil Perfil del usuario
   * @returns Ruta del dashboard correspondiente
   */
  getDashboardRoute(userPerfil: perfil): string {
    switch (userPerfil) {
      case perfil.Duenio:
        return DASHBOARD_CONFIG.duenio.path;
      case perfil.Supervisor:
        return DASHBOARD_CONFIG.supervisor.path;
      case perfil.Maitre:
        return DASHBOARD_CONFIG.maitre.path;
      case perfil.Mozo:
        return DASHBOARD_CONFIG.mozo.path;
      case perfil.Cocinero:
        return DASHBOARD_CONFIG.cocinero.path;
      case perfil.Bartender:
        return DASHBOARD_CONFIG.bartender.path;
      case perfil.ClienteRegistrado:
        return DASHBOARD_CONFIG.cliente.path;
      case perfil.ClienteAnonimo:
        return '/menu'; // Los anónimos van directo al menú
      default:
        return DASHBOARD_CONFIG.duenio.path; // Fallback por defecto
    }
  }

  /**
   * Obtiene el título del dashboard según el perfil
   * @param userPerfil Perfil del usuario
   * @returns Título del dashboard
   */
  getDashboardTitle(userPerfil: perfil): string {
    switch (userPerfil) {
      case perfil.Duenio:
        return DASHBOARD_CONFIG.duenio.title;
      case perfil.Supervisor:
        return DASHBOARD_CONFIG.supervisor.title;
      case perfil.Maitre:
        return DASHBOARD_CONFIG.maitre.title;
      case perfil.Mozo:
        return DASHBOARD_CONFIG.mozo.title;
      case perfil.Cocinero:
        return DASHBOARD_CONFIG.cocinero.title;
      case perfil.Bartender:
        return DASHBOARD_CONFIG.bartender.title;
      case perfil.ClienteRegistrado:
        return DASHBOARD_CONFIG.cliente.title;
      case perfil.ClienteAnonimo:
        return 'Menú';
      default:
        return DASHBOARD_CONFIG.duenio.title;
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
    return dashboardPath === allowedRoute || dashboardPath.includes(allowedRoute.split('/').pop() || '');
  }

  /**
   * Obtiene todas las rutas de dashboard disponibles
   * @returns Array con todas las configuraciones de dashboard
   */
  getAllDashboardConfigs() {
    return DASHBOARD_CONFIG;
  }

  /**
   * Verifica si una ruta es un dashboard válido
   * @param path Ruta a verificar
   * @returns true si es un dashboard válido
   */
  isValidDashboardRoute(path: string): boolean {
    const allPaths: string[] = Object.values(DASHBOARD_CONFIG).map(config => config.path);
    return allPaths.includes(path) || path === '/menu';
  }
}