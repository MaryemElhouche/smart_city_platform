import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface GraphQLQuery {
  id: string;
  query: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class GraphqlApiService {
  private baseUrl = environment.apiGatewayUrl + environment.endpoints.dataExplorer;
  
  constructor(private http: HttpClient) {}
  
  executeQuery(query: string): Observable<any> {
    // Mock response based on query content
    let mockResponse = {};
    
    if (query.includes('sensors')) {
      mockResponse = {
        data: {
          sensors: [
            { id: 'AQ001', zone: 'Downtown', aqi: 45 },
            { id: 'AQ002', zone: 'Industrial', aqi: 125 }
          ]
        }
      };
    } else if (query.includes('vehicles')) {
      mockResponse = {
        data: {
          vehicles: [
            { id: 'BUS001', type: 'bus', status: 'running' },
            { id: 'TRAM001', type: 'tram', status: 'running' }
          ]
        }
      };
    } else {
      mockResponse = {
        data: {
          message: 'Query executed successfully'
        }
      };
    }
    
    return of(mockResponse).pipe(delay(800));
  }
  
  getQueryHistory(): GraphQLQuery[] {
    const history = localStorage.getItem('graphql_history');
    return history ? JSON.parse(history) : [];
  }
  
  saveQuery(query: string) {
    const history = this.getQueryHistory();
    const newQuery: GraphQLQuery = {
      id: Date.now().toString(),
      query,
      timestamp: new Date().toISOString()
    };
    
    history.unshift(newQuery);
    if (history.length > 10) history.pop();
    
    localStorage.setItem('graphql_history', JSON.stringify(history));
  }
  
  getQueryCount(): Observable<number> {
    return of(this.getQueryHistory().length).pipe(delay(200));
  }
}