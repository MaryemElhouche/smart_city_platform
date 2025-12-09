import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Card } from '../../shared/ui/card/card';
import { Button } from '../../shared/ui/button/button';
import { GraphQLService } from '../../core/services/graphql.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-data-explorer',
  standalone: true,
  imports: [CommonModule, FormsModule, Card, Button],
  templateUrl: './data-explorer.html',
  styleUrl: './data-explorer.scss',
})
export class DataExplorer {
  currentQuery = '';
  result = signal<any>(null);
  executing = signal(false);
  queryHistory = signal<Array<{query: string, timestamp: string}>>([]);
  
  constructor(
    private graphqlService: GraphQLService,
    private toast: ToastService
  ) {}
  
  insertQuery(type: string) {
    const queries: Record<string, string> = {
      cityOverview: `query {
  getCityOverview(zoneId: "zone1") {
    zone {
      id
      name
      type
    }
    currentAQI
    trendingPollutants
    nearestStations {
      id
      name
      latitude
      longitude
    }
    activeIncidents {
      id
      type
      location
      status
    }
  }
}`,
      incidents: `query {
  getAllIncidents {
    id
    type
    description
    severity
    status
    reportedAt
    resolvedAt
  }
}`,
      travelSuggestions: `query {
  getTravelSuggestions(fromStation: "Central", toStation: "North") {
    fromStation
    toStation
    recommendedLine
    estimatedTime
    airQualityRecommendation
  }
}`
    };
    
    this.currentQuery = queries[type] || '';
  }
  
  executeQuery() {
    if (!this.currentQuery.trim()) {
      this.toast.warning('Please enter a query');
      return;
    }
    
    this.executing.set(true);
    this.graphqlService.executeQuery(this.currentQuery).subscribe({
      next: (result) => {
        this.result.set(result);
        this.queryHistory.update(history => [
          { query: this.currentQuery, timestamp: new Date().toISOString() },
          ...history.slice(0, 9)
        ]);
        this.executing.set(false);
        this.toast.success('Query executed successfully');
      },
      error: (err) => {
        this.executing.set(false);
        this.toast.error('Query execution failed: ' + err.message);
      }
    });
  }
  
  loadQuery(query: {query: string, timestamp: string}) {
    this.currentQuery = query.query;
  }
  
  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }
}
