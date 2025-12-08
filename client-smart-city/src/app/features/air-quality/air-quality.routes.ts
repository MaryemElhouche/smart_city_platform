import { Routes } from '@angular/router';

export const AIR_QUALITY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./sensors-list/sensors-list').then(m => m.SensorsList)
  },
  {
    path: 'sensor/:id',
    loadComponent: () => import('./sensor-details/sensor-details').then(m => m.SensorDetails)
  },
  {
    path: 'sensors-list',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'sensor-details/:id',
    redirectTo: 'sensor/:id',
    pathMatch: 'full'
  }
];