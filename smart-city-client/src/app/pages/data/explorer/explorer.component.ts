import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-graphql-explorer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="explorer-page">
      <div class="page-header">
        <h2>GraphQL Explorer</h2>
        <p class="subtitle">Interactive query builder for the Smart City API</p>
      </div>

      <div class="explorer-layout">
        <!-- Query Editor -->
        <div class="editor-panel">
          <div class="panel-header">
            <h3><i class="fas fa-code"></i> Query Editor</h3>
            <div class="panel-actions">
              <button class="btn btn-secondary btn-sm" (click)="formatQuery()">
                <i class="fas fa-magic"></i> Format
              </button>
              <button class="btn btn-secondary btn-sm" (click)="clearQuery()">
                <i class="fas fa-trash"></i> Clear
              </button>
            </div>
          </div>
          <div class="editor-body">
            <textarea 
              [(ngModel)]="query" 
              placeholder="Enter your GraphQL query here..."
              spellcheck="false"
              class="query-editor">
            </textarea>
          </div>
          <div class="editor-footer">
            <div class="variables-toggle" (click)="showVariables = !showVariables">
              <i class="fas" [class.fa-chevron-right]="!showVariables" [class.fa-chevron-down]="showVariables"></i>
              Query Variables
            </div>
            @if (showVariables) {
              <textarea 
                [(ngModel)]="variables" 
                placeholder='{ "key": "value" }'
                class="variables-editor">
              </textarea>
            }
            <button class="btn btn-primary btn-execute" (click)="executeQuery()" [disabled]="loading">
              @if (loading) {
                <div class="spinner-small"></div>
                Executing...
              } @else {
                <i class="fas fa-play"></i> Execute Query
              }
            </button>
          </div>
        </div>

        <!-- Results Panel -->
        <div class="results-panel">
          <div class="panel-header">
            <h3><i class="fas fa-file-alt"></i> Results</h3>
            @if (executionTime) {
              <span class="execution-time">
                <i class="fas fa-clock"></i> {{ executionTime }}ms
              </span>
            }
          </div>
          <div class="results-body">
            @if (!result && !error) {
              <div class="empty-results">
                <i class="fas fa-terminal"></i>
                <p>Execute a query to see results</p>
              </div>
            } @else if (error) {
              <div class="error-result">
                <div class="error-header">
                  <i class="fas fa-exclamation-circle"></i>
                  Error
                </div>
                <pre class="error-content">{{ error }}</pre>
              </div>
            } @else {
              <pre class="result-content">{{ result | json }}</pre>
            }
          </div>
        </div>

        <!-- Schema Panel -->
        <div class="schema-panel">
          <div class="panel-header">
            <h3><i class="fas fa-book"></i> Schema Docs</h3>
          </div>
          <div class="schema-body">
            <div class="schema-section">
              <h4>Queries</h4>
              <div class="schema-items">
                <div class="schema-item" (click)="insertQuery('getCityOverview')">
                  <span class="query-name">getCityOverview</span>
                  <span class="query-args">(zoneId: ID!)</span>
                  <span class="query-type">: CityOverview</span>
                </div>
                <div class="schema-item" (click)="insertQuery('getTravelSuggestions')">
                  <span class="query-name">getTravelSuggestions</span>
                  <span class="query-args">(from: String!, to: String!)</span>
                  <span class="query-type">: TravelSuggestions</span>
                </div>
                <div class="schema-item" (click)="insertQuery('getIncidentSummary')">
                  <span class="query-name">getIncidentSummary</span>
                  <span class="query-args">(id: ID!)</span>
                  <span class="query-type">: IncidentSummary</span>
                </div>
                <div class="schema-item" (click)="insertQuery('getAllIncidents')">
                  <span class="query-name">getAllIncidents</span>
                  <span class="query-type">: [IncidentSummary!]!</span>
                </div>
              </div>
            </div>

            <div class="schema-section">
              <h4>Types</h4>
              <div class="type-accordion">
                @for (type of schemaTypes; track type.name) {
                  <div class="type-item">
                    <div class="type-header" (click)="type.expanded = !type.expanded">
                      <i class="fas" [class.fa-chevron-right]="!type.expanded" [class.fa-chevron-down]="type.expanded"></i>
                      <span class="type-name">{{ type.name }}</span>
                    </div>
                    @if (type.expanded) {
                      <div class="type-fields">
                        @for (field of type.fields; track field.name) {
                          <div class="field-item">
                            <span class="field-name">{{ field.name }}</span>
                            <span class="field-type">: {{ field.type }}</span>
                          </div>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Example Queries -->
      <div class="examples-section">
        <h3>Example Queries</h3>
        <div class="examples-grid">
          @for (example of examples; track example.name) {
            <div class="example-card" (click)="loadExample(example)">
              <div class="example-icon">
                <i [class]="example.icon"></i>
              </div>
              <div class="example-content">
                <span class="example-name">{{ example.name }}</span>
                <span class="example-desc">{{ example.description }}</span>
              </div>
              <i class="fas fa-arrow-right example-arrow"></i>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .subtitle {
      color: var(--gray-500);
      font-size: 14px;
      margin-top: 4px;
    }

    .explorer-layout {
      display: grid;
      grid-template-columns: 1fr 1fr 300px;
      gap: 20px;
      margin-bottom: 32px;
    }

    .editor-panel, .results-panel, .schema-panel {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid var(--gray-100);
      background: var(--gray-50);
    }

    .panel-header h3 {
      font-size: 14px;
      font-weight: 600;
      color: var(--gray-700);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .panel-header h3 i {
      color: var(--primary);
    }

    .panel-actions {
      display: flex;
      gap: 8px;
    }

    .btn-sm {
      padding: 6px 12px;
      font-size: 12px;
    }

    .execution-time {
      font-size: 12px;
      color: var(--gray-500);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .editor-body {
      flex: 1;
      padding: 0;
    }

    .query-editor {
      width: 100%;
      height: 300px;
      padding: 16px;
      border: none;
      resize: none;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 13px;
      line-height: 1.6;
      color: var(--gray-800);
      background: #1e1e1e;
      color: #d4d4d4;
    }

    .query-editor:focus {
      outline: none;
    }

    .editor-footer {
      padding: 16px;
      border-top: 1px solid var(--gray-100);
      background: var(--gray-50);
    }

    .variables-toggle {
      font-size: 13px;
      color: var(--gray-600);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }

    .variables-editor {
      width: 100%;
      height: 80px;
      padding: 12px;
      border: 1px solid var(--gray-200);
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      resize: none;
      margin-bottom: 12px;
    }

    .btn-execute {
      width: 100%;
      padding: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .spinner-small {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .results-body {
      flex: 1;
      padding: 16px;
      overflow: auto;
      background: #1e1e1e;
      min-height: 300px;
    }

    .empty-results {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #6b7280;
    }

    .empty-results i {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .result-content {
      font-family: monospace;
      font-size: 12px;
      color: #9cdcfe;
      white-space: pre-wrap;
      margin: 0;
    }

    .error-result {
      background: #2d1f1f;
      border-radius: 8px;
      overflow: hidden;
    }

    .error-header {
      padding: 12px 16px;
      background: #dc2626;
      color: white;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .error-content {
      padding: 16px;
      color: #f87171;
      font-family: monospace;
      font-size: 12px;
      margin: 0;
    }

    .schema-body {
      flex: 1;
      overflow: auto;
      padding: 16px;
    }

    .schema-section {
      margin-bottom: 24px;
    }

    .schema-section h4 {
      font-size: 12px;
      font-weight: 600;
      color: var(--gray-500);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }

    .schema-items {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .schema-item {
      padding: 10px 12px;
      background: var(--gray-50);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 12px;
    }

    .schema-item:hover {
      background: var(--primary);
    }

    .schema-item:hover .query-name,
    .schema-item:hover .query-args,
    .schema-item:hover .query-type {
      color: white;
    }

    .query-name {
      color: #2563eb;
      font-weight: 600;
    }

    .query-args {
      color: var(--gray-500);
    }

    .query-type {
      color: #059669;
    }

    .type-accordion {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .type-item {
      background: var(--gray-50);
      border-radius: 8px;
      overflow: hidden;
    }

    .type-header {
      padding: 10px 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
    }

    .type-header:hover {
      background: var(--gray-100);
    }

    .type-name {
      color: #9333ea;
      font-weight: 500;
    }

    .type-fields {
      padding: 0 12px 12px 28px;
    }

    .field-item {
      font-size: 12px;
      padding: 4px 0;
    }

    .field-name {
      color: var(--gray-700);
    }

    .field-type {
      color: #059669;
    }

    .examples-section h3 {
      font-size: 18px;
      font-weight: 600;
      color: var(--gray-800);
      margin-bottom: 16px;
    }

    .examples-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 12px;
    }

    .example-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: white;
      border: 1px solid var(--gray-200);
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .example-card:hover {
      border-color: var(--primary);
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    .example-icon {
      width: 44px;
      height: 44px;
      background: var(--gray-100);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: var(--primary);
    }

    .example-content {
      flex: 1;
    }

    .example-name {
      display: block;
      font-weight: 600;
      color: var(--gray-800);
      font-size: 14px;
    }

    .example-desc {
      font-size: 12px;
      color: var(--gray-500);
    }

    .example-arrow {
      color: var(--gray-400);
      transition: transform 0.2s;
    }

    .example-card:hover .example-arrow {
      transform: translateX(4px);
      color: var(--primary);
    }

    @media (max-width: 1200px) {
      .explorer-layout {
        grid-template-columns: 1fr 1fr;
      }
      .schema-panel {
        grid-column: 1 / -1;
      }
    }

    @media (max-width: 768px) {
      .explorer-layout {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class GraphqlExplorerComponent implements OnInit {
  query = '';
  variables = '';
  result: any = null;
  error: string | null = null;
  loading = false;
  showVariables = false;
  executionTime: number | null = null;

  schemaTypes = [
    {
      name: 'CityOverview',
      expanded: false,
      fields: [
        { name: 'zone', type: 'Zone!' },
        { name: 'currentAQI', type: 'Float!' },
        { name: 'trendingPollutants', type: '[String!]!' },
        { name: 'nearestStations', type: '[Station!]!' },
        { name: 'activeIncidents', type: '[EmergencyEventSummary!]!' }
      ]
    },
    {
      name: 'Zone',
      expanded: false,
      fields: [
        { name: 'id', type: 'ID!' },
        { name: 'name', type: 'String!' },
        { name: 'coordinates', type: 'String' }
      ]
    },
    {
      name: 'Station',
      expanded: false,
      fields: [
        { name: 'id', type: 'ID!' },
        { name: 'name', type: 'String!' },
        { name: 'location', type: 'String!' }
      ]
    },
    {
      name: 'TravelSuggestions',
      expanded: false,
      fields: [
        { name: 'fromStation', type: 'String!' },
        { name: 'toStation', type: 'String!' },
        { name: 'recommendedLine', type: 'String!' },
        { name: 'airQualityRecommendation', type: 'String!' }
      ]
    },
    {
      name: 'IncidentSummary',
      expanded: false,
      fields: [
        { name: 'id', type: 'ID!' },
        { name: 'type', type: 'String!' },
        { name: 'location', type: 'String!' },
        { name: 'status', type: 'String!' },
        { name: 'etaOfUnit', type: 'String' }
      ]
    }
  ];

  examples = [
    {
      name: 'Get All Incidents',
      description: 'Fetch all incident summaries',
      icon: 'fas fa-clipboard-list',
      query: `query {
  getAllIncidents {
    id
    type
    location
    status
    etaOfUnit
  }
}`
    },
    {
      name: 'City Overview',
      description: 'Get comprehensive zone data',
      icon: 'fas fa-city',
      query: `query GetCityOverview($zoneId: ID!) {
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
      status
    }
  }
}`,
      variables: '{ "zoneId": "zone1" }'
    },
    {
      name: 'Travel Suggestions',
      description: 'Get route recommendations',
      icon: 'fas fa-route',
      query: `query GetTravelSuggestions($from: String!, $to: String!) {
  getTravelSuggestions(from: $from, to: $to) {
    fromStation
    toStation
    recommendedLine
    airQualityRecommendation
  }
}`,
      variables: '{ "from": "Central Station", "to": "Airport Express" }'
    },
    {
      name: 'Incident Details',
      description: 'Get single incident by ID',
      icon: 'fas fa-search',
      query: `query GetIncidentSummary($id: ID!) {
  getIncidentSummary(id: $id) {
    id
    type
    location
    status
    etaOfUnit
  }
}`,
      variables: '{ "id": "incident123" }'
    }
  ];

  constructor(
    private http: HttpClient,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.query = this.examples[0].query;
  }

  executeQuery(): void {
    if (!this.query.trim()) {
      this.toastService.error('Please enter a query');
      return;
    }

    this.loading = true;
    this.error = null;
    this.result = null;
    const startTime = performance.now();

    let parsedVariables = {};
    if (this.variables.trim()) {
      try {
        parsedVariables = JSON.parse(this.variables);
      } catch (e) {
        this.error = 'Invalid JSON in variables';
        this.loading = false;
        return;
      }
    }

    this.http.post<any>('/graphql', {
      query: this.query,
      variables: parsedVariables
    }).subscribe({
      next: (response) => {
        this.executionTime = Math.round(performance.now() - startTime);
        if (response.errors) {
          this.error = response.errors.map((e: any) => e.message).join('\n');
        } else {
          this.result = response.data;
        }
        this.loading = false;
      },
      error: (err) => {
        this.executionTime = Math.round(performance.now() - startTime);
        this.error = err.message || 'Request failed';
        this.loading = false;
      }
    });
  }

  formatQuery(): void {
    // Basic formatting
    try {
      this.query = this.query
        .replace(/\s+/g, ' ')
        .replace(/\{ /g, '{\n  ')
        .replace(/ \}/g, '\n}')
        .replace(/, /g, '\n  ')
        .trim();
    } catch (e) {
      this.toastService.error('Could not format query');
    }
  }

  clearQuery(): void {
    this.query = '';
    this.variables = '';
    this.result = null;
    this.error = null;
    this.executionTime = null;
  }

  insertQuery(queryName: string): void {
    const example = this.examples.find(e => e.query.includes(queryName));
    if (example) {
      this.loadExample(example);
    }
  }

  loadExample(example: any): void {
    this.query = example.query;
    this.variables = example.variables || '';
    this.showVariables = !!example.variables;
    this.result = null;
    this.error = null;
    this.executionTime = null;
  }
}
