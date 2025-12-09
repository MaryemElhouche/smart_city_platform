import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle, Transport, Station, TransportLine } from '../models/mobility.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MobilityService {
  private readonly apiUrl = `${environment.apiUrl}/mobility/api`;

  constructor(private http: HttpClient) {}

  // Vehicles
  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.apiUrl}/vehicles`);
  }

  getVehicle(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.apiUrl}/vehicles/${id}`);
  }

  createVehicle(vehicle: Omit<Vehicle, 'id'>): Observable<Vehicle> {
    return this.http.post<Vehicle>(`${this.apiUrl}/vehicles`, vehicle);
  }

  updateVehicle(id: number, vehicle: Partial<Vehicle>): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.apiUrl}/vehicles/${id}`, vehicle);
  }

  deleteVehicle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/vehicles/${id}`);
  }

  // Transport Lines
  getTransportLines(): Observable<TransportLine[]> {
    return this.http.get<TransportLine[]>(`${this.apiUrl}/lines`);
  }

  getTransportLine(id: number): Observable<TransportLine> {
    return this.http.get<TransportLine>(`${this.apiUrl}/lines/${id}`);
  }

  // Stations
  getStations(): Observable<Station[]> {
    return this.http.get<Station[]>(`${this.apiUrl}/stations`);
  }

  getStation(id: number): Observable<Station> {
    return this.http.get<Station>(`${this.apiUrl}/stations/${id}`);
  }

  getStationsByLine(lineId: number): Observable<Station[]> {
    return this.http.get<Station[]>(`${this.apiUrl}/stations/line/${lineId}`);
  }

  // Transports
  getTransports(): Observable<Transport[]> {
    return this.http.get<Transport[]>(`${this.apiUrl}/transports`);
  }

  getTransport(id: number): Observable<Transport> {
    return this.http.get<Transport>(`${this.apiUrl}/transports/${id}`);
  }

  getTransportsByRoute(origin: string, destination: string): Observable<Transport[]> {
    return this.http.get<Transport[]>(`${this.apiUrl}/transports/search`, {
      params: { origin, destination }
    });
  }

  getDelayedTransports(): Observable<Transport[]> {
    return this.http.get<Transport[]>(`${this.apiUrl}/transports/delayed`);
  }
}
