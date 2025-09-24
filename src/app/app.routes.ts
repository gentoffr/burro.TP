import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dash-duenio', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {path: "dash-duenio", loadComponent: () => import('./features/dashboards/dash-duenio/dash-duenio.component').then(m => m.DashDuenioComponent)},
];
