# Data GraphQL Service

This service provides a unified GraphQL API for querying smart city data from MongoDB Atlas.

## Entities

### CityOverview
Provides an overview of a specific zone including:
- Zone information
- Current Air Quality Index (AQI)
- Trending pollutants
- Nearest stations
- Active emergency incidents

### TravelSuggestions
Provides travel recommendations between stations with:
- From and to stations
- Recommended transit line
- Air quality recommendations for the route

### IncidentSummary
Emergency incident information including:
- Incident type
- Location
- Status
- Estimated time of arrival (ETA) for response unit

## MongoDB Atlas Configuration

**Database Connection:**
```
URI: mongodb+srv://eyaboudidah_db_user:graphqluser@graphqldb.eguz5jr.mongodb.net/
Database: smart_city
```

**Collections:**
- `city_overviews` - City overview data
- `travel_suggestions` - Travel recommendations
- `incident_summaries` - Emergency incidents
- `zones` - Zone definitions
- `stations` - Station information
- `emergency_events` - Emergency event summaries

## GraphQL API

### Queries

**Get City Overview:**
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

**Get Travel Suggestions:**
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

**Get Incident Summary:**
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

**Get All Incidents:**
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

## Running the Service

1. Build the project:
```bash
mvn clean install
```

2. Run the service:
```bash
mvn spring-boot:run
```

The service will start on port **8084**.

## GraphQL Playground

Access GraphiQL interface at:
```
http://localhost:8084/graphiql
```

## Sample Data

The service automatically initializes with sample data including:
- 2 city overviews (Downtown and Suburban zones)
- 2 travel suggestions
- 3 incident summaries

## Dependencies

- Spring Boot 3.1.6
- Spring Data MongoDB
- Spring GraphQL
- Lombok
- MongoDB Atlas connection

## Health Check

```
http://localhost:8084/actuator/health
```
