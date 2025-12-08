import { Routes } from '@angular/router';

export const MOBILITY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./vehicles-list/vehicles-list').then(m => m.VehiclesList)
  },
  {
    path: 'map',
    loadComponent: () => import('./vehicles-map/vehicles-map').then(m => m.VehiclesMap)
  }
];