// Air Quality Models

export interface Zone {
  id?: string;
  name: string;
  population?: number;
  type: string;
  adminRegion?: string;
  areaKm2?: number;
  updatedAt?: string;
}

export interface Sensor {
  id?: string;
  zone: string;
  model: string;
  manufacturer?: string;
  firmwareVersion?: string;
  installedAt?: string;
  lastCalibration?: string;
  latitude?: number;
  longitude?: number;
  status: string;
  ipAddress?: string;
}

export interface Measurement {
  id?: string;
  sensorId: string;
  zone: string;
  aqi: number;
  pm25?: number;
  pm10?: number;
  no2?: number;
  co2?: number;
  o3?: number;
  temperature?: number;
  humidity?: number;
  batteryLevel?: number;
  source?: string;
  rawRef?: string;
  measurementTime?: string;
  ingestedAt?: string;
}

export interface Alert {
  id?: string;
  zone: string;
  type: string;
  metric?: string;
  value?: number;
  severity: string;
  createdAt?: string;
  resolved: boolean;
  resolvedAt?: string;
  source?: string;
  description?: string;
}

export interface AirQualityStats {
  totalZones: number;
  totalSensors: number;
  activeSensors: number;
  totalMeasurements: number;
  unresolvedAlerts: number;
  averageAqi: number;
}
