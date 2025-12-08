import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AirQualitySensor {
  id: string;
  zone: string;
  currentAQI: number;
  status: 'good' | 'moderate' | 'unhealthy' | 'hazardous';
  alert: boolean;
  lastUpdate: string;
  coordinates: [number, number];
}

export interface AQIHistory {
  timestamp: string;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class AirQualityApiService {
  private readonly baseUrl = environment.apiGatewayUrl + environment.endpoints.airQuality;
  
  constructor(private readonly http: HttpClient) {}
  
  // Mock data
  private readonly mockSensors: AirQualitySensor[] = [
    { id: 'AQ001', zone: 'Downtown', currentAQI: 45, status: 'good', alert: false, lastUpdate: '2025-12-06T10:30:00', coordinates: [36.8065, 10.1815] },
    { id: 'AQ002', zone: 'Industrial Area', currentAQI: 125, status: 'unhealthy', alert: true, lastUpdate: '2025-12-06T10:28:00', coordinates: [36.8365, 10.1515] },
    { id: 'AQ003', zone: 'Residential North', currentAQI: 78, status: 'moderate', alert: false, lastUpdate: '2025-12-06T10:32:00', coordinates: [36.8265, 10.2015] },
    { id: 'AQ004', zone: 'Port Area', currentAQI: 165, status: 'unhealthy', alert: true, lastUpdate: '2025-12-06T10:25:00', coordinates: [36.8165, 10.1315] },
    { id: 'AQ005', zone: 'Green Park', currentAQI: 32, status: 'good', alert: false, lastUpdate: '2025-12-06T10:35:00', coordinates: [36.8465, 10.1915] }
  ];
  
  getAllSensors(): Observable<AirQualitySensor[]> {
    return of(this.mockSensors).pipe(delay(500));
  }
  
  getSensorById(id: string): Observable<AirQualitySensor | undefined> {
    return of(this.mockSensors.find(s => s.id === id)).pipe(delay(300));
  }
  
  getSensorHistory(id: string): Observable<AQIHistory[]> {
    const history: AQIHistory[] = [];
    const now = new Date();
    const sensor = this.mockSensors.find(s => s.id === id);
    const baseValue = sensor?.currentAQI || 50;
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 3600000);
      history.push({
        timestamp: time.toISOString(),
        value: baseValue + Math.floor(Math.random() * 30 - 15)
      });
    }
    
    return of(history).pipe(delay(400));
  }
  
  getAlertCount(): Observable<number> {
    return of(this.mockSensors.filter(s => s.alert).length).pipe(delay(200));
  }
}