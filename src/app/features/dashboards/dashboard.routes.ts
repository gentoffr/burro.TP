import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
/**
 * Rutas específicas para dashboards por perfil de usuario
 * Organizadas de manera modular y escalable
 */
export const DASHBOARD_ROUTES: Routes = [
  // Dashboard del Dueño
  {
    path: 'dashboard/duenio',
    loadComponent: () => import('./dash-duenio/dash-duenio.component').then(m => m.DashDuenioComponent),
    canActivate: [AuthGuard],
    data: { 
      title: 'Dashboard Dueño',
      requiredRole: 'duenio'
    }
  },
  
  // Registro de Empleados (solo para dueños)
  {
    path: 'empleado/registro',
    loadComponent: () => import('./dash-duenio/registro-empleados/register.empleado').then(m => m.RegisterComponentEmpleado),
    data: { 
      title: 'Registro de Empleado',
      requiredRole: 'duenio'
    }
  },
  
  // Dashboard del Supervisor
  {
    path: 'dashboard/supervisor',
    loadComponent: () => import('./dash-duenio/dash-duenio.component').then(m => m.DashDuenioComponent), // Temporal - crear dash-supervisor
    data: { 
      title: 'Dashboard Supervisor',
      requiredRole: 'supervisor'
    }
  },
  
  // Dashboard del Maitre
  {
    path: 'dashboard/maitre',
    loadComponent: () => import('./dash-duenio/dash-duenio.component').then(m => m.DashDuenioComponent), // Temporal - crear dash-maitre
    data: { 
      title: 'Dashboard Maitre',
      requiredRole: 'maitre'
    }
  },
  
  // Dashboard del Mozo
  {
    path: 'dashboard/mozo',
    loadComponent: () => import('./dash-duenio/dash-duenio.component').then(m => m.DashDuenioComponent), // Temporal - crear dash-mozo
    data: { 
      title: 'Dashboard Mozo',
      requiredRole: 'mozo'
    }
  },
  
  // Dashboard del Cocinero
  {
    path: 'dashboard/cocinero',
    loadComponent: () => import('./dash-duenio/dash-duenio.component').then(m => m.DashDuenioComponent), // Temporal - crear dash-cocinero
    data: { 
      title: 'Dashboard Cocinero',
      requiredRole: 'cocinero'
    }
  },
  
  // Dashboard del Bartender
  {
    path: 'dashboard/bartender',
    loadComponent: () => import('./dash-duenio/dash-duenio.component').then(m => m.DashDuenioComponent), // Temporal - crear dash-bartender
    data: { 
      title: 'Dashboard Bartender',
      requiredRole: 'bartender'
    }
  },
  
  // Dashboard del Cliente
  {
    path: 'dashboard/cliente',
    loadComponent: () => import('./dash-duenio/dash-duenio.component').then(m => m.DashDuenioComponent), // Temporal - crear dash-cliente
    data: { 
      title: 'Dashboard Cliente',
      requiredRole: 'cliente'
    }
  },

  // Rutas de compatibilidad (redirects de rutas antiguas)
  {
    path: 'dash-duenio',
    redirectTo: 'dashboard/duenio',
    pathMatch: 'full'
  },
  
  // Redirect por defecto para /dashboard
  {
    path: 'dashboard',
    redirectTo: 'dashboard/duenio',
    pathMatch: 'full'
  }
];

/**
 * Configuración de rutas con metadata para facilitar la gestión
 */
export const DASHBOARD_CONFIG = {
  duenio: {
    path: '/dashboard/duenio',
    component: 'DashDuenioComponent',
    title: 'Dashboard Dueño'
  },
  supervisor: {
    path: '/dashboard/supervisor',
    component: 'DashSupervisorComponent', // Pendiente crear
    title: 'Dashboard Supervisor'
  },
  maitre: {
    path: '/dashboard/maitre',
    component: 'DashMaitreComponent', // Pendiente crear
    title: 'Dashboard Maitre'
  },
  mozo: {
    path: '/dashboard/mozo',
    component: 'DashMozoComponent', // Pendiente crear
    title: 'Dashboard Mozo'
  },
  cocinero: {
    path: '/dashboard/cocinero',
    component: 'DashCocineroComponent', // Pendiente crear
    title: 'Dashboard Cocinero'
  },
  bartender: {
    path: '/dashboard/bartender',
    component: 'DashBartenderComponent', // Pendiente crear
    title: 'Dashboard Bartender'
  },
  cliente: {
    path: '/dashboard/cliente',
    component: 'DashClienteComponent', // Pendiente crear
    title: 'Dashboard Cliente'
  }
} as const;