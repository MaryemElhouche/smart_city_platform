import { Routes } from '@angular/router';

export const EMERGENCY_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'timeline',
    pathMatch: 'full'
  },
  {
    path: 'timeline',
    loadComponent: () => import('./timeline/timeline').then(m => m.Timeline)
  },
  {
    path: 'report',
    loadComponent: () => import('./report-form/report-form').then(m => m.ReportForm)
  }
];