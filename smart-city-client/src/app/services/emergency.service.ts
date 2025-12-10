import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, catchError, map } from 'rxjs';
import { EmergencyEvent, EmergencyUnit, Resource, IncidentLog, EmergencyDashboardStats } from '../models/emergency.models';

@Injectable({
  providedIn: 'root'
})
export class EmergencyService {
  private baseUrl = '/emergency/api';

  constructor(private http: HttpClient) {}

  // ==================== EMERGENCY EVENTS ====================

  getEvents(): Observable<EmergencyEvent[]> {
    return this.http.get<EmergencyEvent[]>(`${this.baseUrl}/events`);
  }

  getEvent(id: number): Observable<EmergencyEvent> {
    return this.http.get<EmergencyEvent>(`${this.baseUrl}/events/${id}`);
  }

  createEvent(event: EmergencyEvent): Observable<EmergencyEvent> {
    return this.http.post<EmergencyEvent>(`${this.baseUrl}/events`, event);
  }

  assignUnitToEvent(eventId: number, unitId: number): Observable<EmergencyEvent> {
    return this.http.put<EmergencyEvent>(`${this.baseUrl}/events/${eventId}/assign/${unitId}`, {});
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/events/${id}`);
  }

  // ==================== EMERGENCY UNITS ====================

  getUnits(): Observable<EmergencyUnit[]> {
    return this.http.get<EmergencyUnit[]>(`${this.baseUrl}/units`);
  }

  getUnit(id: number): Observable<EmergencyUnit> {
    return this.http.get<EmergencyUnit>(`${this.baseUrl}/units/${id}`);
  }

  createUnit(unit: EmergencyUnit): Observable<EmergencyUnit> {
    return this.http.post<EmergencyUnit>(`${this.baseUrl}/units`, unit);
  }

  updateUnitStatus(id: number, status: string): Observable<EmergencyUnit> {
    return this.http.put<EmergencyUnit>(`${this.baseUrl}/units/${id}/status?status=${status}`, {});
  }

  deleteUnit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/units/${id}`);
  }

  // ==================== RESOURCES ====================

  getResources(): Observable<Resource[]> {
    return this.http.get<Resource[]>(`${this.baseUrl}/resources`);
  }

  createResource(resource: Resource): Observable<Resource> {
    return this.http.post<Resource>(`${this.baseUrl}/resources`, resource);
  }

  updateResourceStatus(id: number, status: string): Observable<Resource> {
    return this.http.put<Resource>(`${this.baseUrl}/resources/${id}/status?status=${status}`, {});
  }

  deleteResource(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/resources/${id}`);
  }

  // ==================== INCIDENT LOGS ====================

  getLogs(): Observable<IncidentLog[]> {
    return this.http.get<IncidentLog[]>(`${this.baseUrl}/logs`);
  }

  getLog(id: number): Observable<IncidentLog> {
    return this.http.get<IncidentLog>(`${this.baseUrl}/logs/${id}`);
  }

  createLog(log: IncidentLog): Observable<IncidentLog> {
    return this.http.post<IncidentLog>(`${this.baseUrl}/logs`, log);
  }

  updateLog(id: number, log: IncidentLog): Observable<IncidentLog> {
    return this.http.put<IncidentLog>(`${this.baseUrl}/logs/${id}`, log);
  }

  deleteLog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/logs/${id}`);
  }

  // ==================== DASHBOARD ====================

  getDashboardStats(): Observable<EmergencyDashboardStats> {
    return forkJoin({
      events: this.getEvents().pipe(catchError(() => of([]))),
      units: this.getUnits().pipe(catchError(() => of([]))),
      resources: this.getResources().pipe(catchError(() => of([]))),
      logs: this.getLogs().pipe(catchError(() => of([])))
    }).pipe(
      map(data => ({
        events: data.events.length,
        units: data.units.length,
        resources: data.resources.length,
        logs: data.logs.length,
        criticalEvents: data.events.filter(e => e.severity === 'CRITICAL' || e.severity === 'HIGH').slice(0, 5),
        availableUnits: data.units.filter(u => u.status === 'AVAILABLE').slice(0, 5)
      }))
    );
  }
}
