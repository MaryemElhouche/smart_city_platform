# Smart City Platform

## Description
Plateforme de gestion intelligente pour les villes modernes. Cette solution microservices intègre la surveillance de la qualité de l'air, la gestion de la mobilité urbaine, la coordination des services d'urgence et l'agrégation de données via GraphQL.

## Architecture Globale

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                         │
│    ┌─────────────────┐                      ┌─────────────────┐             │
│    │  Angular Client │                      │   Mobile Apps   │             │
│    │    (Port 4200)  │                      │                 │             │
│    └────────┬────────┘                      └────────┬────────┘             │
└─────────────┼────────────────────────────────────────┼──────────────────────┘
              │                                        │
              └────────────────┬───────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          API GATEWAY (Port 8080)                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  • Routing    • Authentication    • Rate Limiting    • CORS        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
        ┌────────────┬────────────┼────────────┬────────────┐
        │            │            │            │            │
        ▼            ▼            ▼            ▼            │
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Air Quality  │   Mobility   │  Emergency   │Data GraphQL  │
│    SOAP      │    REST      │    gRPC      │   GraphQL    │
│  Port 8083   │  Port 8081   │  Port 8082   │  Port 8084   │
├──────────────┼──────────────┼──────────────┼──────────────┤
│   MongoDB    │  PostgreSQL  │  PostgreSQL  │   MongoDB    │
│    Atlas     │              │              │    Atlas     │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

## Services

| Service | Port | Type | Base de données | Description |
|---------|------|------|-----------------|-------------|
| **Gateway** | 8080 | HTTP | - | Passerelle API centrale |
| **Mobility** | 8081 | REST | PostgreSQL | Gestion transports urbains |
| **Emergency** | 8082 | gRPC/REST | PostgreSQL | Services d'urgence |
| **Air Quality** | 8083 | SOAP/REST | MongoDB | Qualité de l'air |
| **Data GraphQL** | 8084 | GraphQL | MongoDB | Agrégation de données |

## Structure du Projet

```
smart_city_platform/
├── gateway/                    # API Gateway
│   ├── src/
│   └── pom.xml
├── services/
│   ├── air-quality-soap/       # Service Qualité de l'Air
│   │   ├── src/
│   │   └── pom.xml
│   ├── mobility/               # Service Mobilité
│   │   ├── src/
│   │   └── pom.xml
│   ├── emergency-grpc/         # Service Urgences
│   │   ├── src/
│   │   └── pom.xml
│   └── data-graphql/           # Service GraphQL
│       ├── src/
│       └── pom.xml
├── client-smart-city/          # Client Angular
├── docker-compose.yml          # Docker Compose
└── pom.xml                     # POM parent
```

## Prérequis

- **Java:** 17+
- **Maven:** 3.8+
- **Node.js:** 18+ (pour le client Angular)
- **Docker & Docker Compose** (optionnel)
- **PostgreSQL:** 14+ (pour mobility et emergency)
- **MongoDB Atlas** (pour air-quality et data-graphql)

## Démarrage Rapide

### 1. Cloner le projet
```bash
git clone https://github.com/MaryemElhouche/smart_city_platform.git
cd smart_city_platform
```

### 2. Configuration des variables d'environnement

**Pour les services PostgreSQL (Mobility & Emergency):**
```bash
# Mobility
export DB_URL_MOBILITY=jdbc:postgresql://localhost:5432/mobility_db
export DB_USERNAME_MOBILITY=your_username
export DB_PASSWORD_MOBILITY=your_password

# Emergency
export DB_URL_EMERGENCY=jdbc:postgresql://localhost:5432/emergency_db
export DB_USERNAME_EMERGENCY=your_username
export DB_PASSWORD_EMERGENCY=your_password
```

### 3. Build du projet
```bash
mvn clean install
```

### 4. Démarrer les services

**Option A: Individuellement**
```bash
# Gateway
mvn spring-boot:run -pl gateway

# Mobility Service
mvn spring-boot:run -pl services/mobility

# Emergency Service
mvn spring-boot:run -pl services/emergency-grpc

# Air Quality Service
mvn spring-boot:run -pl services/air-quality-soap

# Data GraphQL Service
mvn spring-boot:run -pl services/data-graphql
```

**Option B: Avec Docker Compose**
```bash
docker-compose up -d
```

### 5. Démarrer le client Angular
```bash
cd client-smart-city
npm install
ng serve
```

## Accès aux Services

### Via Gateway (Recommandé)
| Service | URL Gateway |
|---------|-------------|
| Air Quality | `http://localhost:8080/air-quality/api/*` |
| Mobility | `http://localhost:8080/mobility/api/*` |
| Emergency | `http://localhost:8080/emergency/api/*` |
| GraphQL | `http://localhost:8080/graphql` |

### Accès Direct
| Service | URL Directe |
|---------|-------------|
| Gateway Info | `http://localhost:8080/api/gateway/info` |
| Mobility | `http://localhost:8081/api/*` |
| Emergency | `http://localhost:8082/api/*` |
| Air Quality | `http://localhost:8083/api/*` |
| GraphQL | `http://localhost:8084/graphql` |
| Client Angular | `http://localhost:4200` |

## Authentification Gateway

Le gateway utilise une authentification Basic:
```
Username: admin
Password: admin123
```

Exemple:
```bash
curl -u admin:admin123 http://localhost:8080/air-quality/api/zones
```

## Endpoints Principaux

### Air Quality Service
- `GET /api/zones` - Liste des zones
- `GET /api/sensors` - Liste des capteurs
- `GET /api/measurements` - Liste des mesures
- `GET /api/alerts` - Liste des alertes

### Mobility Service
- `GET /api/vehicles` - Liste des véhicules
- `GET /api/lines` - Liste des lignes
- `GET /api/stations` - Liste des stations
- `GET /api/transports` - Liste des transports

### Emergency Service
- `GET /api/events` - Liste des événements d'urgence
- `GET /api/units` - Liste des unités d'intervention
- `GET /api/resources` - Liste des ressources
- `GET /api/logs` - Journaux d'incidents

### Data GraphQL Service
```graphql
query {
  getCityOverview(zoneId: "zone1") { ... }
  getTravelSuggestions(from: "A", to: "B") { ... }
  getAllIncidents { ... }
}
```

## Tests

```bash
# Tous les tests
mvn test

# Tests par service
mvn test -pl services/air-quality-soap
mvn test -pl services/mobility
mvn test -pl services/emergency-grpc
mvn test -pl services/data-graphql
```

## Monitoring

Tous les services exposent des endpoints Actuator:
- `/actuator/health` - État de santé
- `/actuator/info` - Informations
- `/actuator/metrics` - Métriques

## Documentation des Services

Chaque service possède sa propre documentation détaillée:
- [Gateway](./gateway/README.md)
- [Air Quality SOAP](./services/air-quality-soap/README.md)
- [Mobility REST](./services/mobility/README.md)
- [Emergency gRPC](./services/emergency-grpc/README.md)
- [Data GraphQL](./services/data-graphql/README.md)

## Technologies Utilisées

### Backend
- **Java 17**
- **Spring Boot 3.x**
- **Spring Cloud Gateway**
- **Spring Data JPA**
- **Spring Data MongoDB**
- **Spring GraphQL**
- **gRPC**
- **Maven**

### Frontend
- **Angular 17+**
- **TypeScript**
- **SCSS**

### Bases de Données
- **PostgreSQL** (Mobility, Emergency)
- **MongoDB Atlas** (Air Quality, Data GraphQL)

### Infrastructure
- **Docker**
- **Docker Compose**

## Contributeurs

- **Maryem Elhouche** - Propriétaire du projet

## Licence

Ce projet est sous licence privée.
