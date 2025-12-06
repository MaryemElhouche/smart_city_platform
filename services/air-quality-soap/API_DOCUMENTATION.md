# Air Quality SOAP Service - API Documentation

## Base URL
`http://localhost:8083`

---

## 📍 Zones API

### Get All Zones
```
GET /api/zones
```

### Get Zone by Name
```
GET /api/zones/{name}
Example: /api/zones/Hammamet
```

### Get Zones by Type
```
GET /api/zones/type/{type}
Example: /api/zones/type/tourist
Types: residential, industrial, tourist
```

### Get Zones by Admin Region
```
GET /api/zones/region/{adminRegion}
Example: /api/zones/region/Nabeul
```

### Create/Update Zone
```
POST /api/zones
Content-Type: application/json

{
  "name": "Hammamet",
  "population": 110000,
  "type": "tourist",
  "adminRegion": "Nabeul",
  "areaKm2": 36.0
}
```

### Delete Zone
```
DELETE /api/zones/{id}
```

---

## 🔧 Sensors API

### Get All Sensors
```
GET /api/sensors
```

### Get Sensor by ID
```
GET /api/sensors/{id}
Example: /api/sensors/sensor-hammamet-01
```

### Get Sensors by Zone
```
GET /api/sensors/zone/{zone}
Example: /api/sensors/zone/hammamet
```

### Get Sensors by Status
```
GET /api/sensors/status/{status}
Example: /api/sensors/status/active
Status values: active, inactive, maintenance
```

### Create Sensor
```
POST /api/sensors
Content-Type: application/json

{
  "id": "sensor-hammamet-01",
  "zone": "hammamet",
  "model": "AQM-2000",
  "manufacturer": "EnviroTech",
  "firmwareVersion": "2.1.5",
  "latitude": 36.4,
  "longitude": 10.6,
  "status": "active",
  "ipAddress": "192.168.1.101"
}
```

### Update Sensor
```
PUT /api/sensors/{id}
Content-Type: application/json

{
  "status": "maintenance",
  "firmwareVersion": "2.1.6"
}
```

### Delete Sensor
```
DELETE /api/sensors/{id}
```

---

## 📊 Measurements API

### Get Latest Measurement by Zone
```
GET /api/measurements/zone/{zone}/latest
Example: /api/measurements/zone/hammamet/latest
```

### Get Latest Measurement by Sensor
```
GET /api/measurements/sensor/{sensorId}/latest
Example: /api/measurements/sensor/sensor-hammamet-01/latest
```

### Get All Measurements for Zone
```
GET /api/measurements/zone/{zone}
Example: /api/measurements/zone/hammamet
```

### Get All Measurements for Sensor
```
GET /api/measurements/sensor/{sensorId}
Example: /api/measurements/sensor/sensor-hammamet-01
```

### Get Historical Measurements
```
GET /api/measurements/zone/{zone}/history?start={startDateTime}&end={endDateTime}
Example: /api/measurements/zone/hammamet/history?start=2025-12-01T00:00:00&end=2025-12-06T23:59:59
```

### Create Measurement
```
POST /api/measurements
Content-Type: application/json

{
  "sensorId": "sensor-hammamet-01",
  "zone": "hammamet",
  "aqi": 65,
  "pm25": 22.4,
  "pm10": 38.7,
  "no2": 32.1,
  "co2": 422.0,
  "o3": 37.8,
  "temperature": 24.5,
  "humidity": 65.0,
  "batteryLevel": 95,
  "source": "mqtt"
}
```

---

## 🚨 Alerts API

### Get All Unresolved Alerts
```
GET /api/alerts/unresolved
```

### Get Alerts by Zone
```
GET /api/alerts/zone/{zone}
Example: /api/alerts/zone/ben-arous
```

### Get Unresolved Alerts by Zone
```
GET /api/alerts/zone/{zone}/unresolved
Example: /api/alerts/zone/ben-arous/unresolved
```

### Get Alerts by Severity
```
GET /api/alerts/severity/{severity}
Example: /api/alerts/severity/unhealthy
Severity levels: moderate, unhealthy, critical
```

### Create Alert
```
POST /api/alerts
Content-Type: application/json

{
  "zone": "ben-arous",
  "type": "AQI",
  "metric": "pm25",
  "value": 42.8,
  "severity": "unhealthy",
  "source": "rule-engine",
  "description": "PM2.5 levels exceed safe limits"
}
```

### Resolve Alert
```
PUT /api/alerts/{id}/resolve
```

### Delete Alert
```
DELETE /api/alerts/{id}
```

---

## 🏛️ Legacy Air Quality API (com.city.mobility)

### Get Air Quality by Zone
```
GET /api/air-quality/{zone}
Example: /api/air-quality/Hammamet
```

### Create Air Quality Data
```
POST /api/air-quality
Content-Type: application/json

{
  "zone": "Hammamet",
  "pm25": 35.5,
  "pm10": 65.2,
  "no2": 28.1,
  "co": 0.9,
  "o3": 48.0
}
```

### Compare Zones
```
GET /api/air-quality/compare?zone1=Hammamet&zone2=Tunis
```

### Get Historical Data
```
GET /api/air-quality/history/{zone}?startDate={start}&endDate={end}
Example: /api/air-quality/history/Hammamet?startDate=2025-12-01T00:00:00&endDate=2025-12-06T23:59:59
```

---

## 🏥 Health & Monitoring

### Health Check
```
GET /actuator/health
```

### Service Info
```
GET /actuator/info
```

### Metrics
```
GET /actuator/metrics
```

---

## 📋 Sample Data Initialized

### Zones:
- **Hammamet** (tourist zone, 110K population)
- **Tunis - Médina** (residential, 638K population)  
- **Ben Arous** (industrial, 88K population)

### Sensors:
- sensor-hammamet-01 (active)
- sensor-tunis-01 (active)
- sensor-benarous-01 (active)

### Measurements:
- Latest readings for all three zones with AQI, pollutant levels, temperature, humidity

### Alerts:
- Active alert for Ben Arous (unhealthy PM2.5 levels)

---

## 🔄 Data Flow

1. **Sensors** collect air quality data in specific **Zones**
2. **Measurements** are recorded with timestamps and metadata
3. **Alerts** are generated when thresholds are exceeded
4. All data is stored in MongoDB collections:
   - `zones`
   - `sensors`
   - `air_quality_measurements`
   - `alerts`
