import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of, forkJoin } from 'rxjs';
import { 
  CityOverview, 
  TravelSuggestions, 
  IncidentSummary,
  GraphQLResponse,
  DataDashboardStats
} from '../models/data.models';

@Injectable({
  providedIn: 'root'
})
export class DataGraphQLService {
  private graphqlUrl = '/graphql';

  constructor(private http: HttpClient) {}

  // Generic GraphQL query method
  private query<T>(query: string, variables?: Record<string, unknown>): Observable<T> {
    return this.http.post<GraphQLResponse<T>>(this.graphqlUrl, { query, variables }).pipe(
      map(response => {
        if (response.errors && response.errors.length > 0) {
          throw new Error(response.errors[0].message);
        }
        return response.data;
      })
    );
  }

  // City Overview queries
  getCityOverview(zoneId: string): Observable<CityOverview | null> {
    const query = `
      query GetCityOverview($zoneId: ID!) {
        getCityOverview(zoneId: $zoneId) {
          zone {
            id
            name
            coordinates
          }
          currentAQI
          trendingPollutants
          nearestStations {
            id
            name
            location
          }
          activeIncidents {
            id
            type
            location
            status
          }
        }
      }
    `;
    return this.query<{ getCityOverview: CityOverview | null }>(query, { zoneId }).pipe(
      map(data => data.getCityOverview)
    );
  }

  // Travel Suggestions queries
  getTravelSuggestions(from: string, to: string): Observable<TravelSuggestions | null> {
    const query = `
      query GetTravelSuggestions($from: String!, $to: String!) {
        getTravelSuggestions(from: $from, to: $to) {
          fromStation
          toStation
          recommendedLine
          airQualityRecommendation
        }
      }
    `;
    return this.query<{ getTravelSuggestions: TravelSuggestions | null }>(query, { from, to }).pipe(
      map(data => data.getTravelSuggestions)
    );
  }

  // Incident Summary queries
  getIncidentSummary(id: string): Observable<IncidentSummary | null> {
    const query = `
      query GetIncidentSummary($id: ID!) {
        getIncidentSummary(id: $id) {
          id
          type
          location
          status
          etaOfUnit
        }
      }
    `;
    return this.query<{ getIncidentSummary: IncidentSummary | null }>(query, { id }).pipe(
      map(data => data.getIncidentSummary)
    );
  }

  getAllIncidents(): Observable<IncidentSummary[]> {
    const query = `
      query GetAllIncidents {
        getAllIncidents {
          id
          type
          location
          status
          etaOfUnit
        }
      }
    `;
    return this.query<{ getAllIncidents: IncidentSummary[] }>(query).pipe(
      map(data => data.getAllIncidents || []),
      catchError(() => of([]))
    );
  }

  // Dashboard stats - combines multiple queries
  getDashboardStats(): Observable<DataDashboardStats> {
    return this.getAllIncidents().pipe(
      map(incidents => ({
        totalZones: 5, // Placeholder - would need separate query
        avgAQI: 45, // Placeholder - would need aggregation
        activeIncidents: incidents.filter(i => i.status !== 'RESOLVED').length,
        travelRoutes: 12 // Placeholder
      })),
      catchError(() => of({
        totalZones: 0,
        avgAQI: 0,
        activeIncidents: 0,
        travelRoutes: 0
      }))
    );
  }
}
