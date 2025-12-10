import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'mobility/dashboard', pathMatch: 'full' },
  
  // Mobility routes
  { 
    path: 'mobility/dashboard', 
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  { 
    path: 'mobility/transports', 
    loadComponent: () => import('./pages/transports/transports.component').then(m => m.TransportsComponent)
  },
  { 
    path: 'mobility/lines', 
    loadComponent: () => import('./pages/lines/lines.component').then(m => m.LinesComponent)
  },
  { 
    path: 'mobility/stations', 
    loadComponent: () => import('./pages/stations/stations.component').then(m => m.StationsComponent)
  },
  { 
    path: 'mobility/vehicles', 
    loadComponent: () => import('./pages/vehicles/vehicles.component').then(m => m.VehiclesComponent)
  },

  // Emergency routes
  { 
    path: 'emergency/dashboard', 
    loadComponent: () => import('./pages/emergency/dashboard/dashboard.component').then(m => m.EmergencyDashboardComponent)
  },
  { 
    path: 'emergency/events', 
    loadComponent: () => import('./pages/emergency/events/events.component').then(m => m.EventsComponent)
  },
  { 
    path: 'emergency/units', 
    loadComponent: () => import('./pages/emergency/units/units.component').then(m => m.UnitsComponent)
  },
  { 
    path: 'emergency/resources', 
    loadComponent: () => import('./pages/emergency/resources/resources.component').then(m => m.ResourcesComponent)
  },
  { 
    path: 'emergency/logs', 
    loadComponent: () => import('./pages/emergency/logs/logs.component').then(m => m.LogsComponent)
  },

  // Air Quality routes (placeholder)
  { 
    path: 'air-quality/dashboard', 
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },

  // Data routes (placeholder)
  { 
    path: 'data/dashboard', 
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },

  // Legacy redirects for backward compatibility
  { path: 'dashboard', redirectTo: 'mobility/dashboard', pathMatch: 'full' },
  { path: 'transports', redirectTo: 'mobility/transports', pathMatch: 'full' },
  { path: 'lines', redirectTo: 'mobility/lines', pathMatch: 'full' },
  { path: 'stations', redirectTo: 'mobility/stations', pathMatch: 'full' },
  { path: 'vehicles', redirectTo: 'mobility/vehicles', pathMatch: 'full' },

  { path: '**', redirectTo: 'mobility/dashboard' }
];
