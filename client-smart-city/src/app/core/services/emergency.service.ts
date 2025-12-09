import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmergencyUnit, EmergencyEvent, Resource, IncidentLog } from '../models/emergency.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmergencyService {
  private readonly apiUrl = `${environment.apiUrl}/emergency/api`;

  constructor(private readonly http: HttpClient) {}

  // Emergency Units
  getUnits(): Observable<EmergencyUnit[]> {
    return this.http.get<EmergencyUnit[]>(`${this.apiUrl}/units`);
  }

  getUnit(id: number): Observable<EmergencyUnit> {
    return this.http.get<EmergencyUnit>(`${this.apiUrl}/units/${id}`);
  }

  getUnitsByType(type: string): Observable<EmergencyUnit[]> {
    return this.http.get<EmergencyUnit[]>(`${this.apiUrl}/units/type/${type}`);
  }

  getUnitsByStatus(status: string): Observable<EmergencyUnit[]> {
    return this.http.get<EmergencyUnit[]>(`${this.apiUrl}/units/status/${status}`);
  }

  createUnit(unit: Omit<EmergencyUnit, 'id'>): Observable<EmergencyUnit> {
    return this.http.post<EmergencyUnit>(`${this.apiUrl}/units`, unit);
  }

  updateUnit(id: number, unit: Partial<EmergencyUnit>): Observable<EmergencyUnit> {
    return this.http.put<EmergencyUnit>(`${this.apiUrl}/units/${id}`, unit);
  }

  deleteUnit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/units/${id}`);
  }

  // Emergency Events
  getEvents(): Observable<EmergencyEvent[]> {
    return this.http.get<EmergencyEvent[]>(`${this.apiUrl}/events`);
  }

  getEvent(id: number): Observable<EmergencyEvent> {
    return this.http.get<EmergencyEvent>(`${this.apiUrl}/events/${id}`);
  }

  getEventsByStatus(status: string): Observable<EmergencyEvent[]> {
    return this.http.get<EmergencyEvent[]>(`${this.apiUrl}/events/status/${status}`);
  }

  getEventsBySeverity(severity: string): Observable<EmergencyEvent[]> {
    return this.http.get<EmergencyEvent[]>(`${this.apiUrl}/events/severity/${severity}`);
  }

  createEvent(event: Omit<EmergencyEvent, 'id'>): Observable<EmergencyEvent> {
    return this.http.post<EmergencyEvent>(`${this.apiUrl}/events`, event);
  }

  updateEvent(id: number, event: Partial<EmergencyEvent>): Observable<EmergencyEvent> {
    return this.http.put<EmergencyEvent>(`${this.apiUrl}/events/${id}`, event);
  }

  // Resources
  getResources(): Observable<Resource[]> {
    return this.http.get<Resource[]>(`${this.apiUrl}/resources`);
  }

  getResource(id: number): Observable<Resource> {
    return this.http.get<Resource>(`${this.apiUrl}/resources/${id}`);
  }

  createResource(resource: Omit<Resource, 'id'>): Observable<Resource> {
    return this.http.post<Resource>(`${this.apiUrl}/resources`, resource);
  }

  // Incident Logs
  getLogs(): Observable<IncidentLog[]> {
    return this.http.get<IncidentLog[]>(`${this.apiUrl}/logs`);
  }

  getLog(id: number): Observable<IncidentLog> {
    return this.http.get<IncidentLog>(`${this.apiUrl}/logs/${id}`);
  }

  getLogsByIncident(incidentId: number): Observable<IncidentLog[]> {
    return this.http.get<IncidentLog[]>(`${this.apiUrl}/logs/incident/${incidentId}`);
  }

  createLog(log: Omit<IncidentLog, 'id'>): Observable<IncidentLog> {
    return this.http.post<IncidentLog>(`${this.apiUrl}/logs`, log);
  }
}
