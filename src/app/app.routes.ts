import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'tabs', pathMatch: 'full' },
  {
    path: 'tabs',
    loadComponent: () => import('./tab1/tab1.page').then(m => m.Tab1Page), // ajustar a tabs container real si existe
  },
  { path: '**', redirectTo: 'tabs' }
];
