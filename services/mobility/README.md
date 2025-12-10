# Mobility REST Service

## Description
Service de gestion de la mobilité urbaine pour la plateforme Smart City. Ce service gère les véhicules, les lignes de transport, les stations et les trajets en temps réel.

## Configuration

| Propriété | Valeur |
|-----------|--------|
| **Port** | 8081 |
| **Base de données** | PostgreSQL |
| **ORM** | Hibernate/JPA |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Mobility Service                          │
├─────────────────────────────────────────────────────────────┤
│  Controllers                                                 │
│  ├── VehicleController       (/api/vehicles)                │
│  ├── TransportLineController (/api/lines)                   │
│  ├── StationController       (/api/stations)                │
│  └── TransportController     (/api/transports)              │
├─────────────────────────────────────────────────────────────┤
│  Services                                                    │
│  ├── VehicleService                                         │
│  ├── TransportLineService                                   │
│  ├── StationService                                         │
│  └── TransportService                                       │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL Database                                         │
└─────────────────────────────────────────────────────────────┘
```

## Endpoints REST API

### Véhicules (`/api/vehicles`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/vehicles` | Récupérer tous les véhicules |
| `POST` | `/api/vehicles` | Créer un nouveau véhicule |

**Exemple de Véhicule:**
```json
{
  "id": 1,
  "registrationNumber": "BUS-001",
  "capacity": 50,
  "status": "ACTIVE"
}
```

### Lignes de Transport (`/api/lines`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/lines` | Récupérer toutes les lignes |
| `GET` | `/api/lines/{id}` | Récupérer une ligne par ID |
| `POST` | `/api/lines` | Créer une nouvelle ligne |
| `PUT` | `/api/lines/{id}` | Mettre à jour une ligne |
| `DELETE` | `/api/lines/{id}` | Supprimer une ligne |

**Exemple de Ligne de Transport:**
```json
{
  "id": 1,
  "lineNumber": "Line A",
  "type": "BUS",
  "stationIds": [1, 2, 3, 4, 5]
}
```

### Stations (`/api/stations`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/stations` | Récupérer toutes les stations |
| `GET` | `/api/stations/{id}` | Récupérer une station par ID |
| `GET` | `/api/stations/line/{lineId}` | Récupérer les stations d'une ligne |
| `GET` | `/api/stations/search?name={name}` | Rechercher par nom |
| `POST` | `/api/stations` | Créer une nouvelle station |
| `PUT` | `/api/stations/{id}` | Mettre à jour une station |
| `DELETE` | `/api/stations/{id}` | Supprimer une station |

**Exemple de Station:**
```json
{
  "id": 1,
  "name": "Central Station",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "lineId": 1
}
```

### Transports (`/api/transports`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/transports` | Récupérer tous les transports |
| `GET` | `/api/transports/{id}` | Récupérer un transport par ID |
| `POST` | `/api/transports` | Créer un nouveau transport |
| `PUT` | `/api/transports/{id}` | Mettre à jour un transport |
| `DELETE` | `/api/transports/{id}` | Supprimer un transport |

**Exemple de Transport:**
```json
{
  "id": 1,
  "origin": "Station A",
  "destination": "Station B",
  "departureTime": "2025-12-10T08:00:00",
  "arrivalTime": "2025-12-10T08:45:00",
  "status": "ON_TIME",
  "delayMinutes": 0,
  "availableSeats": 30,
  "lineId": 1,
  "vehicleId": 1
}
```

## Modèle de Données

```
┌──────────────┐       ┌─────────────────┐       ┌─────────────┐
│   Vehicle    │       │ TransportLine   │       │   Station   │
├──────────────┤       ├─────────────────┤       ├─────────────┤
│ id           │       │ id              │◄──────│ id          │
│ registration │       │ lineNumber      │       │ name        │
│ capacity     │       │ type            │       │ latitude    │
│ status       │       │ stationIds      │       │ longitude   │
└──────┬───────┘       └────────┬────────┘       │ lineId      │
       │                        │                └─────────────┘
       │                        │
       │    ┌───────────────────┘
       │    │
       ▼    ▼
┌─────────────────┐
│    Transport    │
├─────────────────┤
│ id              │
│ origin          │
│ destination     │
│ departureTime   │
│ arrivalTime     │
│ status          │
│ delayMinutes    │
│ availableSeats  │
│ lineId          │
│ vehicleId       │
└─────────────────┘
```

## Technologies

- **Framework:** Spring Boot 3.1.6
- **Java:** 17
- **Base de données:** PostgreSQL
- **ORM:** Spring Data JPA / Hibernate
- **Documentation API:** SpringDoc OpenAPI 2.3.0
- **Build:** Maven

## Démarrage

### Variables d'Environnement Requises

```bash
export DB_URL_MOBILITY=jdbc:postgresql://localhost:5432/mobility_db
export DB_USERNAME_MOBILITY=your_username
export DB_PASSWORD_MOBILITY=your_password
```

### Commandes

```bash
# Compilation
mvn clean package -pl services/mobility

# Exécution
java -jar services/mobility/target/mobility-rest-0.0.1-SNAPSHOT.jar

# Ou avec Maven
mvn spring-boot:run -pl services/mobility
```

## Tests

```bash
# Exécuter les tests
mvn test -pl services/mobility
```

## Documentation API (Swagger)

Une fois le service démarré, accédez à :
- **Swagger UI:** `http://localhost:8081/swagger-ui.html`
- **OpenAPI JSON:** `http://localhost:8081/v3/api-docs`

## Endpoints de Monitoring

| Endpoint | Description |
|----------|-------------|
| `/actuator/health` | État de santé du service |
| `/actuator/info` | Informations sur le service |
| `/actuator/metrics` | Métriques du service |

## Variables d'Environnement

| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `DB_URL_MOBILITY` | URL JDBC PostgreSQL | ✅ |
| `DB_USERNAME_MOBILITY` | Nom d'utilisateur DB | ✅ |
| `DB_PASSWORD_MOBILITY` | Mot de passe DB | ✅ |
