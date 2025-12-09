import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GraphQLQuery, GraphQLResponse, CityOverview, TravelSuggestions, IncidentSummary } from '../models/graphql.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GraphQLService {
  private readonly apiUrl = `${environment.apiUrl}/graphql`;

  constructor(private http: HttpClient) {}

  private query<T>(query: string, variables?: Record<string, any>): Observable<T> {
    const body: GraphQLQuery = { query, variables };
    return this.http.post<GraphQLResponse<T>>(this.apiUrl, body).pipe(
      map(response => {
        if (response.errors) {
          throw new Error(response.errors.map(e => e.message).join(', '));
        }
        return response.data;
      })
    );
  }

  // Get all incidents
  getAllIncidents(): Observable<IncidentSummary[]> {
    const query = `
      query GetAllIncidents {
        getAllIncidents {
          id
          type
          location
          status
        }
      }
    `;
    return this.query<{ getAllIncidents: IncidentSummary[] }>(query).pipe(
      map(data => data.getAllIncidents)
    );
  }

  // Get incident by ID
  getIncidentSummary(id: string): Observable<IncidentSummary> {
    const query = `
      query GetIncident($id: ID!) {
        getIncidentSummary(id: $id) {
          id
          type
          location
          status
        }
      }
    `;
    return this.query<{ getIncidentSummary: IncidentSummary }>(query, { id }).pipe(
      map(data => data.getIncidentSummary)
    );
  }

  // Get city overview for a zone
  getCityOverview(zoneId: string): Observable<CityOverview> {
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
    return this.query<{ getCityOverview: CityOverview }>(query, { zoneId }).pipe(
      map(data => data.getCityOverview)
    );
  }

  // Get travel suggestions
  getTravelSuggestions(from: string, to: string): Observable<TravelSuggestions> {
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
    return this.query<{ getTravelSuggestions: TravelSuggestions }>(query, { from, to }).pipe(
      map(data => data.getTravelSuggestions)
    );
  }

  // Custom query for flexibility
  executeQuery<T>(query: string, variables?: Record<string, any>): Observable<T> {
    return this.query<T>(query, variables);
  }
}
