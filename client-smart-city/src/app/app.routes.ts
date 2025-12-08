import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'air-quality',
    loadChildren: () => import('./features/air-quality/air-quality.routes').then(m => m.AIR_QUALITY_ROUTES)
  },
  {
    path: 'mobility',
    loadChildren: () => import('./features/mobility/mobility.routes').then(m => m.MOBILITY_ROUTES)
  },
  {
    path: 'data-explorer',
    loadComponent: () => import('./features/data-explorer/data-explorer').then(m => m.DataExplorer)
  },
  {
    path: 'emergency',
    loadChildren: () => import('./features/emergency/emergency.routes').then(m => m.EMERGENCY_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];