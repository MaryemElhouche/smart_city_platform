import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sensor, Measurement, Alert, Zone } from '../models/air-quality.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AirQualityService {
  private readonly apiUrl = `${environment.apiUrl}/air-quality/api`;

  constructor(private http: HttpClient) {}

  // Sensors
  getSensors(): Observable<Sensor[]> {
    return this.http.get<Sensor[]>(`${this.apiUrl}/sensors`);
  }

  getSensor(id: string): Observable<Sensor> {
    return this.http.get<Sensor>(`${this.apiUrl}/sensors/${id}`);
  }

  getSensorsByZone(zone: string): Observable<Sensor[]> {
    return this.http.get<Sensor[]>(`${this.apiUrl}/sensors/zone/${zone}`);
  }

  getSensorsByStatus(status: string): Observable<Sensor[]> {
    return this.http.get<Sensor[]>(`${this.apiUrl}/sensors/status/${status}`);
  }

  createSensor(sensor: Omit<Sensor, 'id'>): Observable<Sensor> {
    return this.http.post<Sensor>(`${this.apiUrl}/sensors`, sensor);
  }

  // Measurements
  getMeasurements(): Observable<Measurement[]> {
    return this.http.get<Measurement[]>(`${this.apiUrl}/measurements`);
  }

  getMeasurement(id: string): Observable<Measurement> {
    return this.http.get<Measurement>(`${this.apiUrl}/measurements/${id}`);
  }

  getMeasurementsByZone(zone: string): Observable<Measurement[]> {
    return this.http.get<Measurement[]>(`${this.apiUrl}/measurements/zone/${zone}`);
  }

  getMeasurementsBySensor(sensorId: string): Observable<Measurement[]> {
    return this.http.get<Measurement[]>(`${this.apiUrl}/measurements/sensor/${sensorId}`);
  }

  getLatestMeasurementByZone(zone: string): Observable<Measurement> {
    return this.http.get<Measurement>(`${this.apiUrl}/measurements/zone/${zone}/latest`);
  }

  createMeasurement(measurement: Omit<Measurement, 'id'>): Observable<Measurement> {
    return this.http.post<Measurement>(`${this.apiUrl}/measurements`, measurement);
  }

  // Alerts
  getAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.apiUrl}/alerts`);
  }

  getAlert(id: string): Observable<Alert> {
    return this.http.get<Alert>(`${this.apiUrl}/alerts/${id}`);
  }

  getActiveAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.apiUrl}/alerts/unresolved`);
  }

  getAlertsByZone(zone: string): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.apiUrl}/alerts/zone/${zone}`);
  }

  getAlertsBySeverity(severity: string): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.apiUrl}/alerts/severity/${severity}`);
  }

  // Zones
  getZones(): Observable<Zone[]> {
    return this.http.get<Zone[]>(`${this.apiUrl}/zones`);
  }

  getZone(id: string): Observable<Zone> {
    return this.http.get<Zone>(`${this.apiUrl}/zones/${id}`);
  }

  getZoneByName(name: string): Observable<Zone> {
    return this.http.get<Zone>(`${this.apiUrl}/zones/name/${name}`);
  }

  getZonesByType(type: string): Observable<Zone[]> {
    return this.http.get<Zone[]>(`${this.apiUrl}/zones/type/${type}`);
  }
}
