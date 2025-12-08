import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Emergency {
  id: string;
  zone: string;
  type: 'fire' | 'accident' | 'medical' | 'other';
  description: string;
  status: 'reported' | 'in-progress' | 'resolved';
  timestamp: string;
  imageUrl?: string;
}

export interface EmergencyReport {
  zone: string;
  type: Emergency['type'];
  description: string;
  image?: File;
}

@Injectable({
  providedIn: 'root'
})
export class EmergencyApiService {
  private baseUrl = environment.apiGatewayUrl + environment.endpoints.emergency;
  
  constructor(private http: HttpClient) {}
  
  private mockEmergencies: Emergency[] = [
    { id: 'EM001', zone: 'Downtown', type: 'fire', description: 'Fire in commercial building', status: 'resolved', timestamp: '2025-12-06T08:40:00' },
    { id: 'EM002', zone: 'Highway A1', type: 'accident', description: 'Vehicle collision', status: 'in-progress', timestamp: '2025-12-06T09:15:00' },
    { id: 'EM003', zone: 'Residential North', type: 'medical', description: 'Medical emergency', status: 'in-progress', timestamp: '2025-12-06T10:05:00' }
  ];
  
  getAllEmergencies(): Observable<Emergency[]> {
    return of(this.mockEmergencies).pipe(delay(500));
  }
  
  submitReport(report: EmergencyReport): Observable<{ success: boolean; id: string }> {
    const newEmergency: Emergency = {
      id: 'EM' + (Date.now() % 10000).toString().padStart(3, '0'),
      zone: report.zone,
      type: report.type,
      description: report.description,
      status: 'reported',
      timestamp: new Date().toISOString()
    };
    
    this.mockEmergencies.unshift(newEmergency);
    
    return of({ success: true, id: newEmergency.id }).pipe(delay(600));
  }
  
  getActiveCount(): Observable<number> {
    return of(this.mockEmergencies.filter(e => e.status !== 'resolved').length).pipe(delay(200));
  }
}