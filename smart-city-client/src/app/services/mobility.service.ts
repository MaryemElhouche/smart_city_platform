import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, catchError, map } from 'rxjs';
import { Transport, TransportLine, Station, Vehicle, DashboardStats } from '../models/mobility.models';

@Injectable({
  providedIn: 'root'
})
export class MobilityService {
  private baseUrl = '/mobility/api';

  constructor(private http: HttpClient) {}

  // ==================== TRANSPORTS ====================
  
  getTransports(): Observable<Transport[]> {
    return this.http.get<Transport[]>(`${this.baseUrl}/transports`);
  }

  getTransport(id: number): Observable<Transport> {
    return this.http.get<Transport>(`${this.baseUrl}/transports/${id}`);
  }

  createTransport(transport: Transport): Observable<Transport> {
    return this.http.post<Transport>(`${this.baseUrl}/transports`, transport);
  }

  updateTransport(id: number, transport: Transport): Observable<Transport> {
    return this.http.put<Transport>(`${this.baseUrl}/transports/${id}`, transport);
  }

  deleteTransport(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/transports/${id}`);
  }

  // ==================== LINES ====================

  getLines(): Observable<TransportLine[]> {
    return this.http.get<TransportLine[]>(`${this.baseUrl}/lines`);
  }

  getLine(id: number): Observable<TransportLine> {
    return this.http.get<TransportLine>(`${this.baseUrl}/lines/${id}`);
  }

  createLine(line: TransportLine): Observable<TransportLine> {
    return this.http.post<TransportLine>(`${this.baseUrl}/lines`, line);
  }

  updateLine(id: number, line: TransportLine): Observable<TransportLine> {
    return this.http.put<TransportLine>(`${this.baseUrl}/lines/${id}`, line);
  }

  deleteLine(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/lines/${id}`);
  }

  // ==================== STATIONS ====================

  getStations(): Observable<Station[]> {
    return this.http.get<Station[]>(`${this.baseUrl}/stations`);
  }

  getStation(id: number): Observable<Station> {
    return this.http.get<Station>(`${this.baseUrl}/stations/${id}`);
  }

  getStationsByLine(lineId: number): Observable<Station[]> {
    return this.http.get<Station[]>(`${this.baseUrl}/stations/line/${lineId}`);
  }

  createStation(station: Station): Observable<Station> {
    return this.http.post<Station>(`${this.baseUrl}/stations`, station);
  }

  updateStation(id: number, station: Station): Observable<Station> {
    return this.http.put<Station>(`${this.baseUrl}/stations/${id}`, station);
  }

  deleteStation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/stations/${id}`);
  }

  // ==================== VEHICLES ====================

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.baseUrl}/vehicles`);
  }

  getVehicle(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.baseUrl}/vehicles/${id}`);
  }

  createVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(`${this.baseUrl}/vehicles`, vehicle);
  }

  updateVehicle(id: number, vehicle: Vehicle): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.baseUrl}/vehicles/${id}`, vehicle);
  }

  deleteVehicle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/vehicles/${id}`);
  }

  // ==================== DASHBOARD ====================

  getDashboardStats(): Observable<DashboardStats> {
    return forkJoin({
      transports: this.getTransports().pipe(catchError(() => of([]))),
      lines: this.getLines().pipe(catchError(() => of([]))),
      stations: this.getStations().pipe(catchError(() => of([]))),
      vehicles: this.getVehicles().pipe(catchError(() => of([])))
    }).pipe(
      map(data => ({
        transports: data.transports.length,
        lines: data.lines.length,
        stations: data.stations.length,
        vehicles: data.vehicles.length,
        recentTransports: data.transports.slice(0, 5)
      }))
    );
  }
}
