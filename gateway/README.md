# API Gateway

## Description
Passerelle API centrale pour la plateforme Smart City. Ce gateway route les requêtes vers les différents microservices et fournit des fonctionnalités transverses comme l'authentification, le rate limiting et le CORS.

## Configuration

| Propriété | Valeur |
|-----------|--------|
| **Port** | 8080 |
| **Framework** | Spring Cloud Gateway |
| **Authentification** | Basic Auth |

## Architecture

```
                              ┌─────────────────────┐
                              │   Client/Frontend   │
                              └──────────┬──────────┘
                                         │
                                         ▼
                         ┌───────────────────────────────┐
                         │        API Gateway            │
                         │         (Port 8080)           │
                         │  ┌─────────────────────────┐  │
                         │  │ • Routing               │  │
                         │  │ • Authentication        │  │
                         │  │ • Rate Limiting         │  │
                         │  │ • CORS                  │  │
                         │  └─────────────────────────┘  │
                         └───────────────┬───────────────┘
                                         │
         ┌───────────────┬───────────────┼───────────────┬───────────────┐
         │               │               │               │               │
         ▼               ▼               ▼               ▼               │
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         │
│ Air Quality │ │  Mobility   │ │  Emergency  │ │Data GraphQL │         │
│   (8083)    │ │   (8081)    │ │   (8082)    │ │   (8084)    │         │
│    SOAP     │ │    REST     │ │   gRPC      │ │  GraphQL    │         │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘         │
```

## Routes Configurées

| Route ID | Path | Service Cible | Port |
|----------|------|---------------|------|
| `air-quality-service` | `/air-quality/**` | Air Quality SOAP | 8083 |
| `mobility-service` | `/mobility/**` | Mobility REST | 8081 |
| `emergency-service` | `/emergency/**` | Emergency gRPC | 8082 |
| `data-graphql-service` | `/graphql/**` | Data GraphQL | 8084 |

## Endpoints du Gateway

### Informations Gateway (`/api/gateway`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/gateway/info` | Informations sur le gateway |
| `GET` | `/api/gateway/routes` | Liste des routes configurées |
| `GET` | `/api/gateway/services` | Liste des services disponibles |

**Exemple - Info Gateway:**
```json
{
  "name": "Smart City API Gateway",
  "version": "1.0.0",
  "status": "UP",
  "description": "Central API Gateway for Smart City Platform microservices"
}
```

**Exemple - Services Disponibles:**
```json
{
  "air-quality-soap": {
    "name": "Air Quality Service",
    "type": "SOAP",
    "path": "/air-quality/**",
    "port": "8083"
  },
  "mobility": {
    "name": "Mobility Service",
    "type": "REST",
    "path": "/mobility/**",
    "port": "8081"
  },
  "emergency-grpc": {
    "name": "Emergency Service",
    "type": "gRPC/HTTP",
    "path": "/emergency/**",
    "port": "8082"
  },
  "data-graphql": {
    "name": "Data GraphQL Service",
    "type": "GraphQL",
    "path": "/graphql/**",
    "port": "8084"
  }
}
```

## Mapping des URLs

### Air Quality Service
```
Gateway: http://localhost:8080/air-quality/api/zones
   ↓
Service: http://air-quality-soap:8083/api/zones
```

### Mobility Service
```
Gateway: http://localhost:8080/mobility/api/vehicles
   ↓
Service: http://mobility:8081/api/vehicles
```

### Emergency Service
```
Gateway: http://localhost:8080/emergency/api/events
   ↓
Service: http://emergency-grpc:8082/api/events
```

### Data GraphQL Service
```
Gateway: http://localhost:8080/graphql
   ↓
Service: http://data-graphql:8084/graphql
```

## Sécurité

### Authentification Basic
```
Username: admin
Password: admin123
```

### Rate Limiting
- **Limite:** 100 requêtes par seconde par service
- **Période de rafraîchissement:** 1 seconde

### CORS
- **Origines autorisées:** `*` (toutes)
- **Méthodes autorisées:** GET, POST, PUT, DELETE, OPTIONS

## Technologies

- **Framework:** Spring Boot 3.x
- **Gateway:** Spring Cloud Gateway
- **Resilience:** Resilience4j (Rate Limiting)
- **Build:** Maven

## Démarrage

```bash
# Compilation
mvn clean package -pl gateway

# Exécution
java -jar gateway/target/gateway-0.0.1-SNAPSHOT.jar

# Ou avec Maven
mvn spring-boot:run -pl gateway
```

## Avec Docker

```bash
# Build l'image
docker build -t smart-city-gateway ./gateway

# Exécution
docker run -p 8080:8080 smart-city-gateway
```

## Endpoints de Monitoring

| Endpoint | Description |
|----------|-------------|
| `/actuator/health` | État de santé du gateway |
| `/actuator/info` | Informations sur le gateway |
| `/actuator/gateway/routes` | Routes du gateway |
| `/actuator/metrics` | Métriques du gateway |

## Exemples d'Utilisation via Gateway

### Air Quality - Lister les zones
```bash
curl -u admin:admin123 http://localhost:8080/air-quality/api/zones
```

### Mobility - Lister les véhicules
```bash
curl -u admin:admin123 http://localhost:8080/mobility/api/vehicles
```

### Emergency - Lister les événements
```bash
curl -u admin:admin123 http://localhost:8080/emergency/api/events
```

### Data GraphQL - Requête GraphQL
```bash
curl -u admin:admin123 \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "{ getAllIncidents { id type status } }"}' \
  http://localhost:8080/graphql
```

## Variables d'Environnement

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `SERVER_PORT` | Port du gateway | 8080 |
| `SPRING_SECURITY_USER_NAME` | Utilisateur admin | admin |
| `SPRING_SECURITY_USER_PASSWORD` | Mot de passe admin | admin123 |
