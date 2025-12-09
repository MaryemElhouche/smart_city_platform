export interface Sensor {
  id: string;
  zone: string;
  model: string;
  manufacturer: string;
  firmwareVersion: string;
  installedAt: string;
  lastCalibration: string;
  latitude: number;
  longitude: number;
  status: string; // ACTIVE, MAINTENANCE, OFFLINE
  ipAddress: string;
}

export interface Measurement {
  id: string;
  sensorId: string;
  zone: string;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  co2: number;
  o3: number;
  temperature: number;
  humidity: number;
  batteryLevel: number;
  source: string;
  rawRef: string;
  measurementTime: string;
  ingestedAt: string;
}

export interface Alert {
  id: string;
  zone: string;
  type: string;
  metric: string;
  value: number;
  severity: string; // LOW, MEDIUM, HIGH, CRITICAL
  createdAt: string;
  resolved: boolean;
  resolvedAt?: string;
  source: string;
  description: string;
}

export interface Zone {
  id: string;
  name: string;
  type: 'RESIDENTIAL' | 'INDUSTRIAL' | 'COMMERCIAL' | 'PARK' | 'TOURISM' | 'URBAN';
  coordinates: string;
}
