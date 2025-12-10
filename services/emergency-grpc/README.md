# Emergency gRPC Service

## Description
Service de gestion des urgences pour la plateforme Smart City. Ce service gère les événements d'urgence, les unités d'intervention, les ressources et les journaux d'incidents via des API REST et gRPC.

## Configuration

| Propriété | Valeur |
|-----------|--------|
| **Port HTTP** | 8082 |
| **Base de données** | PostgreSQL |
| **ORM** | Hibernate/JPA |
| **Protocole** | REST + gRPC |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Emergency Service                          │
├─────────────────────────────────────────────────────────────┤
│  REST Controllers                                            │
│  ├── EmergencyEventController  (/api/events)                │
│  ├── EmergencyUnitController   (/api/units)                 │
│  ├── ResourceController        (/api/resources)             │
│  └── IncidentLogController     (/api/logs)                  │
├─────────────────────────────────────────────────────────────┤
│  gRPC Services                                               │
│  └── EmergencyGrpcService                                   │
├─────────────────────────────────────────────────────────────┤
│  Services                                                    │
│  ├── EmergencyEventService                                  │
│  ├── EmergencyUnitService                                   │
│  ├── ResourceService                                        │
│  └── IncidentLogService                                     │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL Database                                         │
└─────────────────────────────────────────────────────────────┘
```

## Endpoints REST API

### Événements d'Urgence (`/api/events`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/events` | Récupérer tous les événements |
| `GET` | `/api/events/{id}` | Récupérer un événement par ID |
| `POST` | `/api/events` | Créer un nouvel événement |
| `PUT` | `/api/events/{eventId}/assign/{unitId}` | Assigner une unité |
| `DELETE` | `/api/events/{id}` | Supprimer un événement |

**Exemple d'Événement d'Urgence:**
```json
{
  "id": 1,
  "description": "Fire at downtown building",
  "severity": "HIGH",
  "status": "ACTIVE",
  "location": {
    "id": 1,
    "latitude": 40.7128,
    "longitude": -74.0060,
    "address": "123 Main St"
  },
  "assignedUnitId": 5
}
```

### Unités d'Intervention (`/api/units`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/units` | Récupérer toutes les unités |
| `GET` | `/api/units/{id}` | Récupérer une unité par ID |
| `POST` | `/api/units` | Créer une nouvelle unité |
| `PUT` | `/api/units/{id}/status?status={status}` | Mettre à jour le statut |
| `DELETE` | `/api/units/{id}` | Supprimer une unité |

**Exemple d'Unité d'Intervention:**
```json
{
  "id": 1,
  "name": "Fire Truck 1",
  "type": "FIRE",
  "status": "AVAILABLE",
  "location": {
    "id": 1,
    "latitude": 40.7128,
    "longitude": -74.0060,
    "address": "Station 5"
  },
  "resourceIds": [1, 2, 3],
  "incidentLogIds": [10, 11]
}
```

**Statuts d'Unité:**
- `AVAILABLE` - Disponible
- `BUSY` - En intervention
- `MAINTENANCE` - En maintenance
- `OFF_DUTY` - Hors service

### Ressources (`/api/resources`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/resources` | Récupérer toutes les ressources |
| `POST` | `/api/resources` | Créer une nouvelle ressource |
| `PUT` | `/api/resources/{id}/status?status={status}` | Mettre à jour le statut |
| `DELETE` | `/api/resources/{id}` | Supprimer une ressource |

**Exemple de Ressource:**
```json
{
  "id": 1,
  "name": "Fire Hose",
  "type": "EQUIPMENT",
  "status": "AVAILABLE",
  "assignedUnitId": 1,
  "assignedEventId": null
}
```

### Journaux d'Incidents (`/api/logs`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/logs` | Récupérer tous les journaux |
| `GET` | `/api/logs/{id}` | Récupérer un journal par ID |
| `POST` | `/api/logs` | Créer un nouveau journal |
| `PUT` | `/api/logs/{id}` | Mettre à jour un journal |
| `DELETE` | `/api/logs/{id}` | Supprimer un journal |

**Exemple de Journal d'Incident:**
```json
{
  "id": 1,
  "message": "Unit dispatched to location",
  "timestamp": "2025-12-10T10:30:00",
  "eventId": 1,
  "unitId": 2,
  "resourceId": 3
}
```

## Modèle de Données

```
┌─────────────────┐       ┌─────────────────┐
│ EmergencyEvent  │       │  EmergencyUnit  │
├─────────────────┤       ├─────────────────┤
│ id              │       │ id              │
│ description     │◄──────│ name            │
│ severity        │       │ type            │
│ status          │       │ status          │
│ location_id     │       │ location_id     │
│ assignedUnitId  │       └────────┬────────┘
└────────┬────────┘                │
         │                         │
         │         ┌───────────────┘
         │         │
         ▼         ▼
┌─────────────────────┐     ┌─────────────────┐
│    IncidentLog      │     │    Resource     │
├─────────────────────┤     ├─────────────────┤
│ id                  │     │ id              │
│ message             │     │ name            │
│ timestamp           │     │ type            │
│ eventId             │     │ status          │
│ unitId              │     │ assignedUnitId  │
│ resourceId          │     │ assignedEventId │
└─────────────────────┘     └─────────────────┘

┌─────────────────┐
│    Location     │
├─────────────────┤
│ id              │
│ latitude        │
│ longitude       │
│ address         │
└─────────────────┘
```

## Technologies

- **Framework:** Spring Boot 3.1.6
- **Java:** 17
- **Base de données:** PostgreSQL
- **ORM:** Spring Data JPA / Hibernate
- **gRPC:** grpc-netty-shaded 1.58.0
- **Protobuf:** 3.21.12
- **Documentation API:** SpringDoc OpenAPI 2.3.0
- **Build:** Maven

## Démarrage

### Variables d'Environnement Requises

```bash
export DB_URL_EMERGENCY=jdbc:postgresql://localhost:5432/emergency_db
export DB_USERNAME_EMERGENCY=your_username
export DB_PASSWORD_EMERGENCY=your_password
```

### Commandes

```bash
# Compilation (inclut génération des classes Protobuf)
mvn clean package -pl services/emergency-grpc

# Exécution
java -jar services/emergency-grpc/target/emergency-grpc-0.0.1-SNAPSHOT.jar

# Ou avec Maven
mvn spring-boot:run -pl services/emergency-grpc
```

## Tests

```bash
# Exécuter les tests
mvn test -pl services/emergency-grpc
```

## Documentation API (Swagger)

Une fois le service démarré, accédez à :
- **Swagger UI:** `http://localhost:8082/swagger-ui.html`
- **OpenAPI JSON:** `http://localhost:8082/v3/api-docs`

## Endpoints de Monitoring

| Endpoint | Description |
|----------|-------------|
| `/actuator/health` | État de santé du service |
| `/actuator/info` | Informations sur le service |
| `/actuator/metrics` | Métriques du service |

## gRPC

Le service expose également des endpoints gRPC pour une communication haute performance entre services.

### Fichiers Proto

Les fichiers `.proto` définissant les services gRPC se trouvent dans :
```
src/main/proto/
```

## Variables d'Environnement

| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `DB_URL_EMERGENCY` | URL JDBC PostgreSQL | ✅ |
| `DB_USERNAME_EMERGENCY` | Nom d'utilisateur DB | ✅ |
| `DB_PASSWORD_EMERGENCY` | Mot de passe DB | ✅ |
