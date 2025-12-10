# Data GraphQL Service

## Description
Service d'agrégation de données pour la plateforme Smart City. Ce service fournit une API GraphQL unifiée pour interroger les données de la ville intelligente depuis MongoDB Atlas.

## Configuration

| Propriété | Valeur |
|-----------|--------|
| **Port** | 8084 |
| **Base de données** | MongoDB Atlas |
| **Base** | smart_city |
| **Protocole** | GraphQL |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Data GraphQL Service                        │
├─────────────────────────────────────────────────────────────┤
│  Controllers                                                 │
│  ├── GraphQLController      (GraphQL Queries)               │
│  ├── GraphiQLController     (/graphiql)                     │
│  └── MongoTestController    (/api/test)                     │
├─────────────────────────────────────────────────────────────┤
│  Services                                                    │
│  └── DataService                                            │
├─────────────────────────────────────────────────────────────┤
│  MongoDB Atlas (smart_city)                                  │
└─────────────────────────────────────────────────────────────┘
```

## Entités

### CityOverview
Vue d'ensemble d'une zone spécifique incluant :
- Informations de la zone
- Indice de qualité de l'air (AQI) actuel
- Polluants en tendance
- Stations les plus proches
- Incidents d'urgence actifs

```json
{
  "id": "overview-1",
  "zone": {
    "id": "zone-1",
    "name": "Downtown",
    "coordinates": "40.7128,-74.0060"
  },
  "currentAQI": 75.5,
  "trendingPollutants": ["PM2.5", "O3"],
  "nearestStations": [],
  "activeIncidents": []
}
```

### TravelSuggestions
Recommandations de voyage entre stations :
- Station de départ et d'arrivée
- Ligne de transport recommandée
- Recommandations sur la qualité de l'air du trajet

```json
{
  "fromStation": "Central Station",
  "toStation": "North Station",
  "recommendedLine": "Line 1",
  "airQualityRecommendation": "Good air quality along route"
}
```

### IncidentSummary
Résumé des incidents d'urgence :
- Type d'incident
- Localisation
- Statut
- Temps d'arrivée estimé (ETA) de l'unité d'intervention

```json
{
  "id": "incident-1",
  "type": "FIRE",
  "location": "123 Main St",
  "status": "ACTIVE",
  "etaOfUnit": "5 min"
}
```

## Collections MongoDB

| Collection | Description |
|------------|-------------|
| `city_overviews` | Données de vue d'ensemble des zones |
| `travel_suggestions` | Recommandations de voyage |
| `incident_summaries` | Résumés des incidents |
| `zones` | Définitions des zones |
| `stations` | Informations des stations |
| `emergency_events` | Résumés des événements d'urgence |

## API GraphQL

### Schéma GraphQL

```graphql
type Zone {
    id: ID!
    name: String!
    coordinates: String
}

type Station {
    id: ID!
    name: String!
    location: String!
}

type EmergencyEventSummary {
    id: ID!
    type: String!
    location: String!
    status: String!
}

type CityOverview {
    zone: Zone!
    currentAQI: Float!
    trendingPollutants: [String!]!
    nearestStations: [Station!]!
    activeIncidents: [EmergencyEventSummary!]!
}

type TravelSuggestions {
    fromStation: String!
    toStation: String!
    recommendedLine: String!
    airQualityRecommendation: String!
}

type IncidentSummary {
    id: ID!
    type: String!
    location: String!
    status: String!
    etaOfUnit: String
}

type Query {
    getCityOverview(zoneId: ID!): CityOverview
    getTravelSuggestions(from: String!, to: String!): TravelSuggestions
    getIncidentSummary(id: ID!): IncidentSummary
    getAllIncidents: [IncidentSummary!]!
}
```

### Exemples de Requêtes

**Obtenir la vue d'ensemble d'une zone:**
```graphql
query {
  getCityOverview(zoneId: "zone1") {
    zone {
      id
      name
      coordinates
    }
    currentAQI
    trendingPollutants
    nearestStations {
      id
      name
      location
    }
    activeIncidents {
      id
      type
      location
      status
    }
  }
}
```

**Obtenir des suggestions de voyage:**
```graphql
query {
  getTravelSuggestions(from: "Central Station", to: "North Station") {
    fromStation
    toStation
    recommendedLine
    airQualityRecommendation
  }
}
```

**Obtenir un résumé d'incident:**
```graphql
query {
  getIncidentSummary(id: "incident1") {
    id
    type
    location
    status
    etaOfUnit
  }
}
```

**Obtenir tous les incidents:**
```graphql
query {
  getAllIncidents {
    id
    type
    location
    status
    etaOfUnit
  }
}
```

## Endpoints REST

### Test de connexion MongoDB (`/api/test`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/test/mongo-connection` | Tester la connexion MongoDB |

**Réponse:**
```json
{
  "status": "SUCCESS",
  "connected": true,
  "database": "smart_city",
  "collections": ["city_overviews", "zones", ...],
  "message": "MongoDB connection is working!"
}
```

## Technologies

- **Framework:** Spring Boot 3.1.6
- **Java:** 17
- **Base de données:** MongoDB Atlas
- **API:** Spring GraphQL
- **Templates:** Thymeleaf (pour GraphiQL)
- **Build:** Maven

## Démarrage

```bash
# Compilation
mvn clean package -pl services/data-graphql

# Exécution
java -jar services/data-graphql/target/data-graphql-0.0.1-SNAPSHOT.jar

# Ou avec Maven
mvn spring-boot:run -pl services/data-graphql
```

## Tests

```bash
# Exécuter les tests
mvn test -pl services/data-graphql
```

## Interfaces

| URL | Description |
|-----|-------------|
| `http://localhost:8084/graphql` | Endpoint GraphQL |
| `http://localhost:8084/graphiql` | Interface GraphiQL (désactivée par défaut) |

## Endpoints de Monitoring

| Endpoint | Description |
|----------|-------------|
| `/actuator/health` | État de santé du service |
| `/actuator/info` | Informations sur le service |

## Données d'Exemple

Le service s'initialise automatiquement avec des données d'exemple :
- 2 vues d'ensemble de zones (Downtown et Suburban)
- 2 suggestions de voyage
- 3 résumés d'incidents
