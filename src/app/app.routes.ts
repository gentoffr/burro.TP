import { Routes } from '@angular/router';

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
  // Rutas de dashboards
  {
    path: "dashboard/duenio", 
    loadComponent: () => import('./features/dashboards/dash-duenio/dash-duenio.component').then(m => m.DashDuenioComponent)
  },
  {
    path: "dashboard/supervisor", 
    loadComponent: () => import('./features/dashboards/dash-duenio/dash-duenio.component').then(m => m.DashDuenioComponent) // Temporal
  },
  {
    path: "dashboard/maitre", 
    loadComponent: () => import('./features/dashboards/dash-duenio/dash-duenio.component').then(m => m.DashDuenioComponent) // Temporal
  },
  {
    path: "dashboard/mozo", 
    loadComponent: () => import('./features/dashboards/dash-duenio/dash-duenio.component').then(m => m.DashDuenioComponent) // Temporal
  },
  {
    path: "dashboard/cocinero", 
    loadComponent: () => import('./features/dashboards/dash-duenio/dash-duenio.component').then(m => m.DashDuenioComponent) // Temporal
  },
  {
    path: "dashboard/bartender", 
    loadComponent: () => import('./features/dashboards/dash-duenio/dash-duenio.component').then(m => m.DashDuenioComponent) // Temporal
  },
  {
    path: "dashboard/cliente", 
    loadComponent: () => import('./features/dashboards/dash-duenio/dash-duenio.component').then(m => m.DashDuenioComponent) // Temporal
  },
  // Mantener la ruta antigua por compatibilidad
  {
    path: "dash-duenio", 
    redirectTo: "dashboard/duenio"
  }
];
