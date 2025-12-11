import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, catchError, map } from 'rxjs';
import { Zone, Sensor, Measurement, Alert, AirQualityStats } from '../models/air-quality.models';

@Injectable({
  providedIn: 'root'
})
export class AirQualityService {
  private baseUrl = '/air-quality/api';

  constructor(private http: HttpClient) {}

  // ==================== ZONES ====================

  getZones(): Observable<Zone[]> {
    return this.http.get<Zone[]>(`${this.baseUrl}/zones`);
  }

  getZone(id: string): Observable<Zone> {
    return this.http.get<Zone>(`${this.baseUrl}/zones/${id}`);
  }

  getZoneByName(name: string): Observable<Zone> {
    return this.http.get<Zone>(`${this.baseUrl}/zones/name/${name}`);
  }

  getZonesByType(type: string): Observable<Zone[]> {
    return this.http.get<Zone[]>(`${this.baseUrl}/zones/type/${type}`);
  }

  createZone(zone: Zone): Observable<Zone> {
    return this.http.post<Zone>(`${this.baseUrl}/zones`, zone);
  }

  updateZone(id: string, zone: Zone): Observable<Zone> {
    return this.http.put<Zone>(`${this.baseUrl}/zones/${id}`, zone);
  }

  deleteZone(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/zones/${id}`);
  }

  // ==================== SENSORS ====================

  getSensors(): Observable<Sensor[]> {
    return this.http.get<Sensor[]>(`${this.baseUrl}/sensors`);
  }

  getSensor(id: string): Observable<Sensor> {
    return this.http.get<Sensor>(`${this.baseUrl}/sensors/${id}`);
  }

  getSensorsByZone(zone: string): Observable<Sensor[]> {
    return this.http.get<Sensor[]>(`${this.baseUrl}/sensors/zone/${zone}`);
  }

  getSensorsByStatus(status: string): Observable<Sensor[]> {
    return this.http.get<Sensor[]>(`${this.baseUrl}/sensors/status/${status}`);
  }

  createSensor(sensor: Sensor): Observable<Sensor> {
    return this.http.post<Sensor>(`${this.baseUrl}/sensors`, sensor);
  }

  updateSensor(id: string, sensor: Sensor): Observable<Sensor> {
    return this.http.put<Sensor>(`${this.baseUrl}/sensors/${id}`, sensor);
  }

  deleteSensor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/sensors/${id}`);
  }

  // ==================== MEASUREMENTS ====================

  getMeasurements(): Observable<Measurement[]> {
    return this.http.get<Measurement[]>(`${this.baseUrl}/measurements`);
  }

  getMeasurement(id: string): Observable<Measurement> {
    return this.http.get<Measurement>(`${this.baseUrl}/measurements/${id}`);
  }

  getMeasurementsByZone(zone: string): Observable<Measurement[]> {
    return this.http.get<Measurement[]>(`${this.baseUrl}/measurements/zone/${zone}`);
  }

  getMeasurementsBySensor(sensorId: string): Observable<Measurement[]> {
    return this.http.get<Measurement[]>(`${this.baseUrl}/measurements/sensor/${sensorId}`);
  }

  getLatestMeasurementByZone(zone: string): Observable<Measurement> {
    return this.http.get<Measurement>(`${this.baseUrl}/measurements/zone/${zone}/latest`);
  }

  createMeasurement(measurement: Measurement): Observable<Measurement> {
    return this.http.post<Measurement>(`${this.baseUrl}/measurements`, measurement);
  }

  deleteMeasurement(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/measurements/${id}`);
  }

  // ==================== ALERTS ====================

  getAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.baseUrl}/alerts`);
  }

  getAlert(id: string): Observable<Alert> {
    return this.http.get<Alert>(`${this.baseUrl}/alerts/${id}`);
  }

  getAlertsByZone(zone: string): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.baseUrl}/alerts/zone/${zone}`);
  }

  getAlertsBySeverity(severity: string): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.baseUrl}/alerts/severity/${severity}`);
  }

  getUnresolvedAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.baseUrl}/alerts/unresolved`);
  }

  createAlert(alert: Alert): Observable<Alert> {
    return this.http.post<Alert>(`${this.baseUrl}/alerts`, alert);
  }

  resolveAlert(id: string): Observable<Alert> {
    return this.http.put<Alert>(`${this.baseUrl}/alerts/${id}/resolve`, {});
  }

  deleteAlert(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/alerts/${id}`);
  }

  // ==================== DASHBOARD STATS ====================

  getDashboardStats(): Observable<AirQualityStats> {
    return forkJoin({
      zones: this.getZones().pipe(catchError(() => of([]))),
      sensors: this.getSensors().pipe(catchError(() => of([]))),
      measurements: this.getMeasurements().pipe(catchError(() => of([]))),
      alerts: this.getUnresolvedAlerts().pipe(catchError(() => of([])))
    }).pipe(
      map(({ zones, sensors, measurements, alerts }) => {
        const activeSensors = sensors.filter(s => s.status === 'ACTIVE' || s.status === 'active').length;
        const totalAqi = measurements.reduce((sum, m) => sum + (m.aqi || 0), 0);
        const averageAqi = measurements.length > 0 ? Math.round(totalAqi / measurements.length) : 0;

        return {
          totalZones: zones.length,
          totalSensors: sensors.length,
          activeSensors,
          totalMeasurements: measurements.length,
          unresolvedAlerts: alerts.length,
          averageAqi
        };
      })
    );
  }
}
