import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataGraphQLService } from '../../../services/data-graphql.service';
import { ToastService } from '../../../services/toast.service';
import { IncidentSummary, DataDashboardStats } from '../../../models/data.models';

@Component({
  selector: 'app-data-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-page">
      <div class="page-header">
        <div>
          <h2>Data Analytics Dashboard</h2>
          <p class="subtitle">GraphQL-powered insights across all city services</p>
        </div>
        <button class="btn btn-secondary" (click)="refreshData()">
          <i class="fas fa-sync-alt"></i> Refresh Data
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card gradient-purple">
          <div class="stat-icon">
            <i class="fas fa-project-diagram"></i>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.totalZones }}</span>
            <span class="stat-label">Connected Zones</span>
          </div>
          <div class="stat-trend up">
            <i class="fas fa-chart-line"></i>
          </div>
        </div>
        <div class="stat-card gradient-teal">
          <div class="stat-icon">
            <i class="fas fa-wind"></i>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.avgAQI }}</span>
            <span class="stat-label">Average AQI</span>
          </div>
          <div class="stat-badge" [ngClass]="getAqiClass(stats.avgAQI)">
            {{ getAqiLabel(stats.avgAQI) }}
          </div>
        </div>
        <div class="stat-card gradient-orange">
          <div class="stat-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.activeIncidents }}</span>
            <span class="stat-label">Active Incidents</span>
          </div>
        </div>
        <div class="stat-card gradient-blue">
          <div class="stat-icon">
            <i class="fas fa-route"></i>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.travelRoutes }}</span>
            <span class="stat-label">Travel Routes</span>
          </div>
        </div>
      </div>

      <!-- Quick Access Cards -->
      <div class="section-header">
        <h3>Quick Access</h3>
        <span class="section-subtitle">Navigate to different data views</span>
      </div>
      <div class="quick-access-grid">
        <a routerLink="/data/city-overview" class="quick-card">
          <div class="quick-icon purple">
            <i class="fas fa-city"></i>
          </div>
          <div class="quick-content">
            <h4>City Overview</h4>
            <p>Comprehensive zone-based city insights with AQI, stations, and incidents</p>
          </div>
          <i class="fas fa-chevron-right quick-arrow"></i>
        </a>
        <a routerLink="/data/travel" class="quick-card">
          <div class="quick-icon teal">
            <i class="fas fa-map-marked-alt"></i>
          </div>
          <div class="quick-content">
            <h4>Travel Suggestions</h4>
            <p>Get smart travel recommendations based on air quality data</p>
          </div>
          <i class="fas fa-chevron-right quick-arrow"></i>
        </a>
        <a routerLink="/data/incidents" class="quick-card">
          <div class="quick-icon orange">
            <i class="fas fa-bell-exclamation"></i>
          </div>
          <div class="quick-content">
            <h4>Incident Summaries</h4>
            <p>View and track all city incident reports and their status</p>
          </div>
          <i class="fas fa-chevron-right quick-arrow"></i>
        </a>
        <a routerLink="/data/explorer" class="quick-card">
          <div class="quick-icon blue">
            <i class="fas fa-code"></i>
          </div>
          <div class="quick-content">
            <h4>GraphQL Explorer</h4>
            <p>Interactive GraphQL query builder for custom data requests</p>
          </div>
          <i class="fas fa-chevron-right quick-arrow"></i>
        </a>
      </div>

      <!-- Recent Incidents -->
      <div class="section-header">
        <h3>Recent Incidents</h3>
        <a routerLink="/data/incidents" class="view-all-link">View All <i class="fas fa-arrow-right"></i></a>
      </div>
      <div class="card">
        <div class="card-body">
          @if (loading) {
            <div class="loading-spinner">
              <div class="spinner"></div>
            </div>
          } @else if (incidents.length === 0) {
            <div class="empty-state small">
              <i class="fas fa-check-circle"></i>
              <p>No active incidents</p>
            </div>
          } @else {
            <div class="incidents-list">
              @for (incident of incidents.slice(0, 5); track incident.id) {
                <div class="incident-row">
                  <div class="incident-icon" [ngClass]="getStatusClass(incident.status)">
                    <i [class]="getIncidentIcon(incident.type)"></i>
                  </div>
                  <div class="incident-info">
                    <span class="incident-type">{{ incident.type }}</span>
                    <span class="incident-location">
                      <i class="fas fa-map-marker-alt"></i> {{ incident.location }}
                    </span>
                  </div>
                  <div class="incident-status">
                    <span class="status-badge" [ngClass]="getStatusClass(incident.status)">
                      {{ incident.status }}
                    </span>
                    @if (incident.etaOfUnit) {
                      <span class="eta">ETA: {{ incident.etaOfUnit }}</span>
                    }
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>

      <!-- GraphQL Info Banner -->
      <div class="info-banner">
        <div class="banner-icon">
          <i class="fas fa-lightbulb"></i>
        </div>
        <div class="banner-content">
          <h4>Powered by GraphQL</h4>
          <p>This dashboard aggregates data from multiple city services using GraphQL queries. 
             You can explore the full schema and run custom queries in the GraphQL Explorer.</p>
        </div>
        <a routerLink="/data/explorer" class="btn btn-primary">
          <i class="fas fa-terminal"></i> Open Explorer
        </a>
      </div>
    </div>
  `,
  styles: [`
    .subtitle {
      color: var(--gray-500);
      font-size: 14px;
      margin-top: 4px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      position: relative;
      padding: 24px;
      border-radius: 16px;
      color: white;
      display: flex;
      align-items: center;
      gap: 16px;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 100%;
      height: 200%;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
    }

    .gradient-purple { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .gradient-teal { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
    .gradient-orange { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .gradient-blue { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }

    .stat-icon {
      width: 56px;
      height: 56px;
      background: rgba(255,255,255,0.2);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      display: block;
      font-size: 32px;
      font-weight: 700;
      line-height: 1.2;
    }

    .stat-label {
      font-size: 13px;
      opacity: 0.9;
    }

    .stat-trend {
      position: absolute;
      top: 16px;
      right: 16px;
      font-size: 14px;
      opacity: 0.8;
    }

    .stat-badge {
      position: absolute;
      bottom: 16px;
      right: 16px;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      background: rgba(255,255,255,0.2);
    }

    .stat-badge.good { background: rgba(22, 163, 74, 0.3); }
    .stat-badge.moderate { background: rgba(217, 119, 6, 0.3); }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .section-header h3 {
      font-size: 18px;
      font-weight: 600;
      color: var(--gray-800);
      margin: 0;
    }

    .section-subtitle {
      color: var(--gray-500);
      font-size: 13px;
      margin-left: 12px;
    }

    .view-all-link {
      font-size: 14px;
      color: var(--primary);
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .view-all-link:hover { text-decoration: underline; }

    .quick-access-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }

    .quick-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: white;
      border: 1px solid var(--gray-200);
      border-radius: 12px;
      transition: all 0.2s;
      cursor: pointer;
    }

    .quick-card:hover {
      border-color: var(--primary);
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      transform: translateY(-2px);
    }

    .quick-icon {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
    }

    .quick-icon.purple { background: #f3e8ff; color: #9333ea; }
    .quick-icon.teal { background: #d1fae5; color: #059669; }
    .quick-icon.orange { background: #fee2e2; color: #dc2626; }
    .quick-icon.blue { background: #dbeafe; color: #2563eb; }

    .quick-content {
      flex: 1;
    }

    .quick-content h4 {
      font-size: 16px;
      font-weight: 600;
      color: var(--gray-800);
      margin-bottom: 4px;
    }

    .quick-content p {
      font-size: 13px;
      color: var(--gray-500);
      margin: 0;
      line-height: 1.4;
    }

    .quick-arrow {
      color: var(--gray-400);
      transition: transform 0.2s;
    }

    .quick-card:hover .quick-arrow {
      transform: translateX(4px);
      color: var(--primary);
    }

    .incidents-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .incident-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 0;
      border-bottom: 1px solid var(--gray-100);
    }

    .incident-row:last-child { border-bottom: none; }

    .incident-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }

    .incident-icon.active { background: #fee2e2; color: #dc2626; }
    .incident-icon.responding { background: #fef3c7; color: #d97706; }
    .incident-icon.resolved { background: #dcfce7; color: #16a34a; }

    .incident-info {
      flex: 1;
    }

    .incident-type {
      display: block;
      font-weight: 600;
      color: var(--gray-800);
      font-size: 14px;
    }

    .incident-location {
      font-size: 12px;
      color: var(--gray-500);
    }

    .incident-location i { margin-right: 4px; }

    .incident-status {
      text-align: right;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.active { background: #fee2e2; color: #dc2626; }
    .status-badge.responding { background: #fef3c7; color: #d97706; }
    .status-badge.resolved { background: #dcfce7; color: #16a34a; }

    .eta {
      display: block;
      font-size: 11px;
      color: var(--gray-500);
      margin-top: 4px;
    }

    .empty-state.small {
      padding: 24px;
      text-align: center;
      color: var(--gray-500);
    }

    .empty-state.small i {
      font-size: 32px;
      color: #16a34a;
      margin-bottom: 8px;
    }

    .info-banner {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 24px;
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border: 1px solid #bae6fd;
      border-radius: 16px;
      margin-top: 24px;
    }

    .banner-icon {
      width: 56px;
      height: 56px;
      background: #0ea5e9;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: white;
      flex-shrink: 0;
    }

    .banner-content {
      flex: 1;
    }

    .banner-content h4 {
      font-size: 16px;
      font-weight: 600;
      color: #0c4a6e;
      margin-bottom: 4px;
    }

    .banner-content p {
      font-size: 13px;
      color: #0369a1;
      margin: 0;
      line-height: 1.5;
    }

    @media (max-width: 1200px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .quick-access-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DataDashboardComponent implements OnInit {
  stats: DataDashboardStats = { totalZones: 0, avgAQI: 0, activeIncidents: 0, travelRoutes: 0 };
  incidents: IncidentSummary[] = [];
  loading = true;

  constructor(
    private dataService: DataGraphQLService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.dataService.getDashboardStats().subscribe({
      next: (stats) => this.stats = stats
    });
    this.dataService.getAllIncidents().subscribe({
      next: (data) => {
        this.incidents = data;
        this.loading = false;
      },
      error: () => {
        this.toastService.error('Failed to load incidents');
        this.loading = false;
      }
    });
  }

  refreshData(): void {
    this.loadData();
    this.toastService.success('Data refreshed');
  }

  getAqiClass(aqi: number): string {
    if (aqi <= 50) return 'good';
    if (aqi <= 100) return 'moderate';
    return 'unhealthy';
  }

  getAqiLabel(aqi: number): string {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    return 'Unhealthy';
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'ACTIVE': return 'active';
      case 'RESPONDING': return 'responding';
      case 'RESOLVED': return 'resolved';
      default: return 'active';
    }
  }

  getIncidentIcon(type: string): string {
    switch (type?.toUpperCase()) {
      case 'FIRE': return 'fas fa-fire';
      case 'ACCIDENT': return 'fas fa-car-crash';
      case 'MEDICAL': return 'fas fa-ambulance';
      case 'CRIME': return 'fas fa-shield-alt';
      default: return 'fas fa-exclamation-triangle';
    }
  }
}
