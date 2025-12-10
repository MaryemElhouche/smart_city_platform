# Air Quality SOAP Service

## Description
Service de surveillance de la qualité de l'air pour la plateforme Smart City. Ce service expose des API REST et SOAP pour la gestion des zones, capteurs, mesures et alertes de qualité de l'air.

## Configuration

| Propriété | Valeur |
|-----------|--------|
| **Port** | 8083 |
| **Base de données** | MongoDB Atlas |
| **Base** | airqualitydb |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Air Quality Service                        │
├─────────────────────────────────────────────────────────────┤
│  Controllers                                                 │
│  ├── ZoneController        (/api/zones)                     │
│  ├── SensorController      (/api/sensors)                   │
│  ├── MeasurementController (/api/measurements)              │
│  └── AlertController       (/api/alerts)                    │
├─────────────────────────────────────────────────────────────┤
│  Services                                                    │
│  ├── ZoneService                                            │
│  ├── SensorService                                          │
│  ├── MeasurementService                                     │
│  └── AlertService                                           │
├─────────────────────────────────────────────────────────────┤
│  MongoDB Atlas (airqualitydb)                               │
└─────────────────────────────────────────────────────────────┘
```

## Endpoints REST API

### Zones (`/api/zones`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/zones` | Récupérer toutes les zones |
| `GET` | `/api/zones/{id}` | Récupérer une zone par ID |
| `GET` | `/api/zones/name/{name}` | Récupérer une zone par nom |
| `GET` | `/api/zones/type/{type}` | Récupérer les zones par type |
| `POST` | `/api/zones` | Créer une nouvelle zone |
| `PUT` | `/api/zones/{id}` | Mettre à jour une zone |
| `DELETE` | `/api/zones/{id}` | Supprimer une zone |

**Exemple de Zone:**
```json
{
  "id": "zone-1",
  "name": "Downtown",
  "population": 50000,
  "type": "urban",
  "adminRegion": "Central",
  "areaKm2": 25.5,
  "updatedAt": "2025-12-10T10:30:00"
}
```

### Capteurs (`/api/sensors`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/sensors` | Récupérer tous les capteurs |
| `GET` | `/api/sensors/{id}` | Récupérer un capteur par ID |
| `GET` | `/api/sensors/zone/{zone}` | Récupérer les capteurs d'une zone |
| `GET` | `/api/sensors/status/{status}` | Récupérer les capteurs par statut |
| `POST` | `/api/sensors` | Créer un nouveau capteur |
| `PUT` | `/api/sensors/{id}` | Mettre à jour un capteur |
| `DELETE` | `/api/sensors/{id}` | Supprimer un capteur |

**Exemple de Capteur:**
```json
{
  "id": "sensor-1",
  "zone": "zone-1",
  "model": "AQ-2000",
  "manufacturer": "EnviroTech",
  "firmwareVersion": "2.1.0",
  "installedAt": "2024-01-15T09:00:00",
  "lastCalibration": "2025-06-01T14:00:00",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "status": "active",
  "ipAddress": "192.168.1.100"
}
```

### Mesures (`/api/measurements`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/measurements` | Récupérer toutes les mesures |
| `GET` | `/api/measurements/{id}` | Récupérer une mesure par ID |
| `GET` | `/api/measurements/zone/{zone}` | Récupérer les mesures d'une zone |
| `GET` | `/api/measurements/sensor/{sensorId}` | Récupérer les mesures d'un capteur |
| `GET` | `/api/measurements/zone/{zone}/latest` | Dernière mesure d'une zone |
| `POST` | `/api/measurements` | Créer une nouvelle mesure |
| `DELETE` | `/api/measurements/{id}` | Supprimer une mesure |

**Exemple de Mesure:**
```json
{
  "id": "measurement-1",
  "sensorId": "sensor-1",
  "zone": "zone-1",
  "aqi": 75,
  "pm25": 18.5,
  "pm10": 32.0,
  "no2": 25.3,
  "co2": 420.0,
  "o3": 45.2,
  "temperature": 22.5,
  "humidity": 65.0,
  "batteryLevel": 85,
  "source": "automatic",
  "measurementTime": "2025-12-10T10:30:00"
}
```

### Alertes (`/api/alerts`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/alerts` | Récupérer toutes les alertes |
| `GET` | `/api/alerts/{id}` | Récupérer une alerte par ID |
| `GET` | `/api/alerts/zone/{zone}` | Récupérer les alertes d'une zone |
| `GET` | `/api/alerts/severity/{severity}` | Récupérer par sévérité |
| `GET` | `/api/alerts/unresolved` | Récupérer les alertes non résolues |
| `POST` | `/api/alerts` | Créer une nouvelle alerte |
| `PUT` | `/api/alerts/{id}/resolve` | Résoudre une alerte |
| `DELETE` | `/api/alerts/{id}` | Supprimer une alerte |

**Exemple d'Alerte:**
```json
{
  "id": "alert-1",
  "zone": "zone-1",
  "type": "AQI_THRESHOLD",
  "metric": "pm25",
  "value": 150.5,
  "severity": "HIGH",
  "createdAt": "2025-12-10T10:30:00",
  "resolved": false,
  "description": "PM2.5 levels exceeded safe threshold"
}
```

## Technologies

- **Framework:** Spring Boot 3.2.0
- **Java:** 17
- **Base de données:** MongoDB Atlas
- **SOAP:** Spring Web Services
- **Documentation:** WSDL4J
- **Build:** Maven

## Démarrage

```bash
# Compilation
mvn clean package -pl services/air-quality-soap

# Exécution
java -jar services/air-quality-soap/target/air-quality-soap-0.0.1-SNAPSHOT.jar

# Ou avec Maven
mvn spring-boot:run -pl services/air-quality-soap
```

## Tests

```bash
# Exécuter les tests
mvn test -pl services/air-quality-soap
```

## Endpoints de Monitoring

| Endpoint | Description |
|----------|-------------|
| `/actuator/health` | État de santé du service |
| `/actuator/info` | Informations sur le service |
| `/actuator/metrics` | Métriques du service |

## Variables d'Environnement

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `MONGODB_URI` | URI de connexion MongoDB | (configuré dans application.yml) |
| `MONGODB_DATABASE` | Nom de la base de données | airqualitydb |
