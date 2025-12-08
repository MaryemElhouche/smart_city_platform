import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Vehicle {
  id: string;
  type: 'bus' | 'tram' | 'bike' | 'scooter';
  status: 'running' | 'stopped' | 'maintenance';
  location: [number, number];
  speed: number;
  route?: string;
  battery?: number;
  lastUpdate: string;
}

@Injectable({
  providedIn: 'root'
})
export class MobilityApiService {
  private baseUrl = environment.apiGatewayUrl + environment.endpoints.mobility;
  
  constructor(private http: HttpClient) {}
  
  private mockVehicles: Vehicle[] = [
    { id: 'BUS001', type: 'bus', status: 'running', location: [36.8065, 10.1815], speed: 35, route: 'Line 5', lastUpdate: '2025-12-06T10:30:00' },
    { id: 'BUS002', type: 'bus', status: 'stopped', location: [36.8165, 10.1915], speed: 0, route: 'Line 3', lastUpdate: '2025-12-06T10:28:00' },
    { id: 'TRAM001', type: 'tram', status: 'running', location: [36.8265, 10.1715], speed: 42, route: 'Tram A', lastUpdate: '2025-12-06T10:32:00' },
    { id: 'BIKE045', type: 'bike', status: 'running', location: [36.8365, 10.1615], speed: 15, battery: 78, lastUpdate: '2025-12-06T10:29:00' },
    { id: 'SCOOT089', type: 'scooter', status: 'running', location: [36.8165, 10.1515], speed: 22, battery: 45, lastUpdate: '2025-12-06T10:31:00' },
    { id: 'BUS003', type: 'bus', status: 'maintenance', location: [36.8465, 10.2015], speed: 0, route: 'Line 7', lastUpdate: '2025-12-06T09:00:00' }
  ];
  
  getAllVehicles(): Observable<Vehicle[]> {
    return of(this.mockVehicles).pipe(delay(500));
  }
  
  getVehiclesByStatus(status: Vehicle['status']): Observable<Vehicle[]> {
    return of(this.mockVehicles.filter(v => v.status === status)).pipe(delay(400));
  }
  
  getOnlineCount(): Observable<number> {
    return of(this.mockVehicles.filter(v => v.status !== 'maintenance').length).pipe(delay(200));
  }
}