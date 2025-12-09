# Client Components Updated for Real Backend Integration

## 🎯 Overview
All UI components have been updated to work with the real backend services and data models.

## ✅ Updated Components

### 1. **Dashboard** (`src/app/features/dashboard/dashboard.ts`)
- ✅ Updated imports to use real services: `AirQualityService`, `MobilityService`, `EmergencyService`, `GraphQLService`
- ✅ Fixed MapMarker position format to use `[lat, lng]` tuple instead of `{lat, lng}` object
- ✅ Updated data loading with `forkJoin` to load all data in parallel
- ✅ Sensor coordinates now use `latitude` and `longitude` properties from real model
- ✅ Station markers properly displayed with bus icon
- ✅ Vehicle count based on `ACTIVE` status
- ✅ Emergency count from `OPEN` events
- ✅ City overview data from GraphQL service

### 2. **Air Quality - Sensors List** (`src/app/features/air-quality/sensors-list/sensors-list.ts`)
- ✅ Updated to use `AirQualityService` instead of mock service
- ✅ Updated columns to match real Sensor model:
  - `id`, `zone`, `model`, `manufacturer`, `status`, `currentAQI`, `installedAt`
- ✅ Added `forkJoin` to load sensors and alerts together
- ✅ MapMarkers use `[latitude, longitude]` format
- ✅ Alert detection based on severity from alerts collection

### 3. **Air Quality - Sensor Details** (`src/app/features/air-quality/sensor-details/sensor-details.ts`)
- ✅ Updated to use real `Sensor` and `Measurement` models
- ✅ Load measurements by sensor ID
- ✅ Chart displays AQI values from measurements
- ✅ CSV export includes all pollutant data: PM2.5, PM10, CO2, NO2, SO2, O3, Temperature, Humidity

### 4. **Mobility - Vehicles List** (`src/app/features/mobility/vehicles-list/vehicles-list.ts`)
- ✅ Updated to use `MobilityService` and real `Vehicle` model
- ✅ Updated columns to match real data:
  - `id`, `registrationNumber`, `type`, `capacity`, `currentOccupancy`, `status`, `lastMaintenance`
- ✅ Status filters updated to match enum: `ACTIVE`, `INACTIVE`, `MAINTENANCE`

### 5. **Mobility - Vehicles Map** (`src/app/features/mobility/vehicles-map/vehicles-map.ts`)
- ✅ Updated to use `MobilityService`
- ✅ Displays stations on map (vehicles don't have location in current model)
- ✅ MapMarkers use `[latitude, longitude]` format for stations

### 6. **Emergency - Timeline** (`src/app/features/emergency/timeline/timeline.ts`)
- ✅ Updated to use `EmergencyService` and `EmergencyEvent` model
- ✅ Status counts updated to match enum: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`
- ✅ Event type icons support: `FIRE`, `ACCIDENT`, `MEDICAL`, `FLOOD`, `CRIME`, `OTHER`

### 7. **Emergency - Report Form** (`src/app/features/emergency/report-form/report-form.ts`)
- ✅ Updated to use `EmergencyService`
- ✅ Form fields match `EmergencyEvent` model
- ✅ Type dropdown with all event types
- ✅ Severity dropdown: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- ✅ Creates event via `createEvent()` API

### 8. **Data Explorer** (`src/app/features/data-explorer/data-explorer.ts`)
- ✅ Updated to use real `GraphQLService`
- ✅ Updated query templates for real GraphQL schema:
  - `cityOverview` - Get city overview with AQI, stations, incidents
  - `incidents` - Get all incidents
  - `travelSuggestions` - Get travel recommendations
- ✅ Query history stored locally

### 9. **Table Component** (`src/app/shared/ui/table/table.ts`)
- ✅ Enhanced `getBadgeClass()` to map status values to proper CSS classes
- ✅ Enhanced `formatBadgeValue()` to format enum values (UNDER_SCORE → Under Score)
- ✅ Status color mapping:
  - `ACTIVE` → success (green)
  - `INACTIVE` → warning (orange)
  - `MAINTENANCE` → info (blue)
  - `OFFLINE` → danger (red)
  - `CRITICAL`/`HIGH` → danger (red)
  - `MEDIUM` → warning (orange)
  - `LOW` → success (green)

## 📊 Data Model Mappings

### Mobility Service
```typescript
Vehicle {
  id: number
  registrationNumber: string
  type: string
  capacity: number
  currentOccupancy: number
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE'
  lastMaintenance: string
}

Station {
  id: number
  name: string
  latitude: number
  longitude: number
  lineId: number
}

Transport {
  id: number
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  status: 'SCHEDULED' | 'IN_TRANSIT' | 'DELAYED' | 'COMPLETED'
  delayMinutes: number
  availableSeats: number
}
```

### Air Quality Service
```typescript
Sensor {
  id: string
  zone: string
  model: string
  manufacturer: string
  firmwareVersion: string
  installedAt: string
  lastCalibration: string
  latitude: number
  longitude: number
  status: 'ACTIVE' | 'MAINTENANCE' | 'OFFLINE'
  ipAddress: string
}

Measurement {
  id: string
  sensorId: string
  zone: string
  timestamp: string
  pm25: number
  pm10: number
  co2: number
  no2: number
  so2: number
  o3: number
  temperature: number
  humidity: number
  aqi: number
}

Alert {
  id: string
  zone: string
  pollutant: string
  level: number
  threshold: number
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  timestamp: string
  message: string
  active: boolean
}
```

### Emergency Service
```typescript
EmergencyUnit {
  id: number
  name: string
  type: 'AMBULANCE' | 'POLICE' | 'FIRE_TRUCK'
  status: 'AVAILABLE' | 'BUSY' | 'OFFLINE'
  location?: Location
  resourceIds?: number[]
}

EmergencyEvent {
  id: number
  type: 'FIRE' | 'ACCIDENT' | 'MEDICAL' | 'FLOOD' | 'CRIME' | 'OTHER'
  description: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  reportedAt: string
  resolvedAt?: string
}
```

### GraphQL Service
```typescript
CityOverview {
  zone: Zone
  currentAQI: number
  trendingPollutants: string[]
  nearestStations: Station[]
  activeIncidents: Incident[]
}
```

## 🔧 API Endpoints Used

### Mobility (`/mobility/api`)
- `GET /vehicles` - All vehicles
- `GET /stations` - All stations
- `GET /transports` - All transports
- `GET /transports/delayed` - Delayed transports

### Air Quality (`/air-quality/api`)
- `GET /sensors` - All sensors
- `GET /sensors/{id}` - Sensor by ID
- `GET /measurements` - All measurements
- `GET /measurements/sensor/{id}` - Measurements for sensor
- `GET /alerts` - All alerts
- `GET /alerts/active` - Active alerts only

### Emergency (`/emergency/api`)
- `GET /units` - All emergency units
- `GET /events` - All events
- `GET /events/status/{status}` - Events by status
- `POST /events` - Create new event

### GraphQL (`/graphql`)
- `POST /graphql` - Execute GraphQL queries
- Available queries: `getCityOverview`, `getAllIncidents`, `getTravelSuggestions`

## 🎨 UI Improvements

1. **Better Status Display**: Status badges now show formatted text (e.g., "In Progress" instead of "IN_PROGRESS")
2. **Color-Coded Statuses**: Each status has appropriate color coding
3. **Real-Time Data**: All components load real data from backend
4. **Error Handling**: Toast notifications for success/error states
5. **Loading States**: Loading indicators while fetching data

## 🚀 Next Steps

1. **Test with Backend Running**: Start all backend services and test the client
2. **Add Pagination**: For large datasets in tables
3. **Add Filtering**: More advanced filtering options
4. **Real-time Updates**: Implement WebSocket for live data updates
5. **Add Charts**: More data visualizations for trends
6. **Form Validation**: Enhanced validation for forms

## 📝 Notes

- All services use the gateway URL from `environment.apiUrl`
- Authentication is handled automatically via `authInterceptor`
- Map components expect `[latitude, longitude]` tuple format
- Date formatting handled by `formatDate()` in table component
- Badge styling handled by enhanced `getBadgeClass()` method
