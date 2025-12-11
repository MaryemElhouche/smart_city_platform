import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Login route (no guard)
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },

  { path: '', redirectTo: 'mobility/dashboard', pathMatch: 'full' },
  
  // Mobility routes (protected)
  { 
    path: 'mobility/dashboard', 
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'mobility/transports', 
    loadComponent: () => import('./pages/transports/transports.component').then(m => m.TransportsComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'mobility/lines', 
    loadComponent: () => import('./pages/lines/lines.component').then(m => m.LinesComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'mobility/stations', 
    loadComponent: () => import('./pages/stations/stations.component').then(m => m.StationsComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'mobility/vehicles', 
    loadComponent: () => import('./pages/vehicles/vehicles.component').then(m => m.VehiclesComponent),
    canActivate: [AuthGuard]
  },

  // Emergency routes (protected)
  { 
    path: 'emergency/dashboard', 
    loadComponent: () => import('./pages/emergency/dashboard/dashboard.component').then(m => m.EmergencyDashboardComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'emergency/events', 
    loadComponent: () => import('./pages/emergency/events/events.component').then(m => m.EventsComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'emergency/units', 
    loadComponent: () => import('./pages/emergency/units/units.component').then(m => m.UnitsComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'emergency/resources', 
    loadComponent: () => import('./pages/emergency/resources/resources.component').then(m => m.ResourcesComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'emergency/logs', 
    loadComponent: () => import('./pages/emergency/logs/logs.component').then(m => m.LogsComponent),
    canActivate: [AuthGuard]
  },

  // Air Quality routes (protected)
  { 
    path: 'air-quality/dashboard', 
    loadComponent: () => import('./pages/air-quality/dashboard/dashboard.component').then(m => m.AirQualityDashboardComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'air-quality/zones', 
    loadComponent: () => import('./pages/air-quality/zones/zones.component').then(m => m.ZonesComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'air-quality/sensors', 
    loadComponent: () => import('./pages/air-quality/sensors/sensors.component').then(m => m.SensorsComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'air-quality/measurements', 
    loadComponent: () => import('./pages/air-quality/measurements/measurements.component').then(m => m.MeasurementsComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'air-quality/alerts', 
    loadComponent: () => import('./pages/air-quality/alerts/alerts.component').then(m => m.AlertsComponent),
    canActivate: [AuthGuard]
  },

  // Data GraphQL routes (protected)
  { 
    path: 'data/dashboard', 
    loadComponent: () => import('./pages/data/dashboard/dashboard.component').then(m => m.DataDashboardComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'data/city-overview', 
    loadComponent: () => import('./pages/data/city-overview/city-overview.component').then(m => m.CityOverviewComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'data/travel', 
    loadComponent: () => import('./pages/data/travel/travel.component').then(m => m.TravelSuggestionsComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'data/incidents', 
    loadComponent: () => import('./pages/data/incidents/incidents.component').then(m => m.IncidentsComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'data/explorer', 
    loadComponent: () => import('./pages/data/explorer/explorer.component').then(m => m.GraphqlExplorerComponent),
    canActivate: [AuthGuard]
  },

  // Legacy redirects for backward compatibility
  { path: 'dashboard', redirectTo: 'mobility/dashboard', pathMatch: 'full' },
  { path: 'transports', redirectTo: 'mobility/transports', pathMatch: 'full' },
  { path: 'lines', redirectTo: 'mobility/lines', pathMatch: 'full' },
  { path: 'stations', redirectTo: 'mobility/stations', pathMatch: 'full' },
  { path: 'vehicles', redirectTo: 'mobility/vehicles', pathMatch: 'full' },

  { path: '**', redirectTo: 'login' }
];
