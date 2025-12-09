# Smart City Platform - Client Integration

## 🎯 Overview

Ce client Angular se connecte au Smart City API Gateway qui route les requêtes vers 4 microservices backend :

- **Mobility Service** (REST) - Port 8081
- **Emergency Service** (gRPC/HTTP) - Port 8082
- **Air Quality Service** (SOAP/REST) - Port 8083
- **Data GraphQL Service** (GraphQL) - Port 8084

## 🔧 Configuration

### Environment Configuration

Le fichier `src/environments/environment.ts` contient :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',  // Gateway URL
  gatewayAuth: {
    username: 'admin',
    password: 'admin123'
  }
};
```

### Authentication

L'intercepteur HTTP ajoute automatiquement l'authentification Basic Auth pour toutes les requêtes vers le gateway.

## 📦 Models

### Mobility Models
- `Vehicle` - Véhicules de transport (bus, métro, tram)
- `Transport` - Trajets planifiés
- `Station` - Stations de transport
- `TransportLine` - Lignes de transport

### Air Quality Models
- `Sensor` - Capteurs de qualité de l'air
- `Measurement` - Mesures de pollution
- `Alert` - Alertes de pollution
- `Zone` - Zones géographiques

### Emergency Models
- `EmergencyUnit` - Unités d'urgence (ambulance, police, pompiers)
- `EmergencyEvent` - Événements d'urgence
- `Resource` - Ressources disponibles
- `IncidentLog` - Logs d'incidents

### GraphQL Models
- `CityOverview` - Vue d'ensemble de la ville
- `TravelSuggestions` - Suggestions de trajets
- `IncidentSummary` - Résumé d'incidents

## 🔌 Services

### MobilityService
```typescript
// Get all vehicles
this.mobilityService.getVehicles().subscribe(vehicles => {
  console.log(vehicles);
});

// Get delayed transports
this.mobilityService.getDelayedTransports().subscribe(transports => {
  console.log(transports);
});

// Search transports by route
this.mobilityService.getTransportsByRoute('Central', 'North').subscribe(transports => {
  console.log(transports);
});
```

### AirQualityService
```typescript
// Get all sensors
this.airQualityService.getSensors().subscribe(sensors => {
  console.log(sensors);
});

// Get active alerts
this.airQualityService.getActiveAlerts().subscribe(alerts => {
  console.log(alerts);
});

// Get latest measurement for a zone
this.airQualityService.getLatestMeasurementByZone('Tunis').subscribe(measurement => {
  console.log(measurement);
});
```

### EmergencyService
```typescript
// Get all emergency units
this.emergencyService.getUnits().subscribe(units => {
  console.log(units);
});

// Get available ambulances
this.emergencyService.getUnitsByType('AMBULANCE').subscribe(ambulances => {
  console.log(ambulances);
});

// Get critical events
this.emergencyService.getEventsBySeverity('CRITICAL').subscribe(events => {
  console.log(events);
});
```

### GraphQLService
```typescript
// Get city overview
this.graphqlService.getCityOverview('zone1').subscribe(overview => {
  console.log('AQI:', overview.currentAQI);
  console.log('Active Incidents:', overview.activeIncidents);
});

// Get travel suggestions
this.graphqlService.getTravelSuggestions('Central Station', 'North Station')
  .subscribe(suggestions => {
    console.log('Recommended Line:', suggestions.recommendedLine);
    console.log('Air Quality:', suggestions.airQualityRecommendation);
  });

// Get all incidents
this.graphqlService.getAllIncidents().subscribe(incidents => {
  console.log(incidents);
});
```

## 🚀 Usage Example

Voir `src/app/features/dashboard/dashboard.component.ts` pour un exemple complet d'utilisation de tous les services.

## 📡 API Endpoints

### Mobility Service (`/mobility`)
- `GET /api/vehicles` - Liste des véhicules
- `GET /api/transports` - Liste des transports
- `GET /api/stations` - Liste des stations
- `GET /api/lines` - Liste des lignes

### Air Quality Service (`/air-quality`)
- `GET /api/sensors` - Liste des capteurs
- `GET /api/measurements` - Liste des mesures
- `GET /api/alerts` - Liste des alertes
- `GET /api/zones` - Liste des zones

### Emergency Service (`/emergency`)
- `GET /api/units` - Liste des unités d'urgence
- `GET /api/events` - Liste des événements
- `GET /api/resources` - Liste des ressources
- `GET /api/logs` - Liste des logs

### GraphQL Service (`/graphql`)
- `POST /graphql` - Endpoint GraphQL principal
- `GET /graphql/graphiql` - Interface GraphiQL (UI)

## 🔒 Security

Le gateway implémente :
- ✅ Basic Authentication (admin/admin123, user/user123)
- ✅ Rate Limiting (10 requêtes/seconde)
- ✅ Security Headers (XSS, HSTS, CSP)
- ✅ Request Logging avec IP tracking

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
ng serve

# Build for production
ng build

# Run tests
ng test
```

## 📝 Notes

- Toutes les requêtes vers le gateway nécessitent une authentification Basic Auth
- Le gateway route automatiquement vers les bons microservices
- GraphQL est accessible sans authentification pour les requêtes (mais pas l'UI)
- Les CORS sont configurés sur le gateway pour accepter toutes les origines
