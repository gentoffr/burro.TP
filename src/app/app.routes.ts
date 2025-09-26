import { Routes } from '@angular/router';
import { DASHBOARD_ROUTES } from './features/dashboards/dashboard.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },

  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  
  // Importar todas las rutas de dashboards desde el módulo especializado
  ...DASHBOARD_ROUTES
];
