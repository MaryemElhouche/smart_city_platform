import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Card } from '../../shared/ui/card/card';
import { Button } from '../../shared/ui/button/button';
import { GraphqlApiService, GraphQLQuery } from '../../core/services/graphql-api.service';
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
  queryHistory = signal<GraphQLQuery[]>([]);
  
  constructor(
    private graphqlService: GraphqlApiService,
    private toast: ToastService
  ) {
    this.queryHistory.set(this.graphqlService.getQueryHistory());
  }
  
  insertQuery(type: string) {
    const queries: Record<string, string> = {
      sensors: `query {
  sensors {
    id
    zone
    aqi
  }
}`,
      vehicles: `query {
  vehicles {
    id
    type
    status
  }
}`,
      emergencies: `query {
  emergencies {
    id
    zone
    type
    status
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
        this.graphqlService.saveQuery(this.currentQuery);
        this.queryHistory.set(this.graphqlService.getQueryHistory());
        this.executing.set(false);
        this.toast.success('Query executed successfully');
      },
      error: () => {
        this.executing.set(false);
        this.toast.error('Query execution failed');
      }
    });
  }
  
  loadQuery(query: GraphQLQuery) {
    this.currentQuery = query.query;
  }
  
  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }
}
