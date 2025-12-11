import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataGraphQLService } from '../../../services/data-graphql.service';
import { ToastService } from '../../../services/toast.service';
import { CityOverview } from '../../../models/data.models';

interface ZoneInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconClass: string;
  status: string;
  statusClass: string;
  aqi: number;
  stations: number;
}

@Component({
  selector: 'app-city-overview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="city-overview-page">
      <div class="page-header">
        <div class="header-content">
          <h2><i class="fas fa-city"></i> City Overview</h2>
          <p class="page-subtitle">Real-time monitoring of your smart city infrastructure</p>
        </div>
      </div>

      <!-- Global Stats Banner -->
      <div class="global-stats-banner">
        <div class="stat-item">
          <div class="stat-icon-wrapper blue">
            <i class="fas fa-map-marked-alt"></i>
          </div>
          <div class="stat-content">
            <span class="stat-number">{{ availableZones.length }}</span>
            <span class="stat-text">Monitored Zones</span>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon-wrapper green">
            <i class="fas fa-wind"></i>
          </div>
          <div class="stat-content">
            <span class="stat-number">{{ globalStats.avgAQI }}</span>
            <span class="stat-text">Avg. AQI</span>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon-wrapper orange">
            <i class="fas fa-train"></i>
          </div>
          <div class="stat-content">
            <span class="stat-number">{{ globalStats.totalStations }}</span>
            <span class="stat-text">Active Stations</span>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon-wrapper red">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="stat-content">
            <span class="stat-number">{{ globalStats.activeIncidents }}</span>
            <span class="stat-text">Active Incidents</span>
          </div>
        </div>
      </div>

      <!-- Zone Selection Section -->
      <div class="zone-selection-section">
        <div class="section-header">
          <h3><i class="fas fa-th-large"></i> Select a Zone for Details</h3>
          <p>Click on any zone card to view detailed information</p>
        </div>
        
        <div class="zones-grid">
          @for (zone of availableZones; track zone.id) {
            <div class="zone-card" 
                 [class.selected]="selectedZoneId === zone.id"
                 [class.loading]="loadingZoneId === zone.id"
                 (click)="selectZone(zone.id)">
              <div class="zone-card-header">
                <div class="zone-icon-wrapper" [ngClass]="zone.iconClass">
                  <i [class]="zone.icon"></i>
                </div>
                <div class="zone-status" [ngClass]="zone.statusClass">
                  <i class="fas fa-circle"></i> {{ zone.status }}
                </div>
              </div>
              <h4 class="zone-name">{{ zone.name }}</h4>
              <p class="zone-description">{{ zone.description }}</p>
              <div class="zone-quick-stats">
                <span><i class="fas fa-wind"></i> AQI: {{ zone.aqi }}</span>
                <span><i class="fas fa-train"></i> {{ zone.stations }} stations</span>
              </div>
              @if (loadingZoneId === zone.id) {
                <div class="zone-loading-overlay">
                  <div class="spinner small"></div>
                </div>
              }
            </div>
          }
        </div>
      </div>

      <!-- Zone Details Section -->
      @if (selectedZoneId && overview) {
        <div class="zone-details-section" id="zone-details">
          <div class="section-header">
            <h3><i class="fas fa-info-circle"></i> Zone Details: {{ overview.zone.name }}</h3>
            <button class="btn btn-secondary btn-sm" (click)="clearSelection()">
              <i class="fas fa-times"></i> Clear Selection
            </button>
          </div>

          <!-- Zone Header Card -->
          <div class="zone-header-card">
            <div class="zone-info">
              <div class="zone-icon-large">
                <i class="fas fa-city"></i>
              </div>
              <div>
                <h3>{{ overview.zone.name }}</h3>
                <span class="zone-coords">
                  <i class="fas fa-map-pin"></i> {{ overview.zone.coordinates || 'Coordinates available on map' }}
                </span>
              </div>
            </div>
            <div class="aqi-display" [ngClass]="getAqiClass(overview.currentAQI)">
              <span class="aqi-value">{{ overview.currentAQI }}</span>
              <span class="aqi-label">Current AQI</span>
              <span class="aqi-status">{{ getAqiLabel(overview.currentAQI) }}</span>
            </div>
          </div>

          <!-- Stats Grid -->
          <div class="detail-stats-grid">
            <div class="stat-card">
              <div class="stat-icon stations">
                <i class="fas fa-train"></i>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ overview.nearestStations?.length || 0 }}</span>
                <span class="stat-label">Nearby Stations</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon incidents">
                <i class="fas fa-exclamation-circle"></i>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ overview.activeIncidents?.length || 0 }}</span>
                <span class="stat-label">Active Incidents</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon pollutants">
                <i class="fas fa-smog"></i>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ overview.trendingPollutants?.length || 0 }}</span>
                <span class="stat-label">Trending Pollutants</span>
              </div>
            </div>
          </div>

          <!-- Content Grid -->
          <div class="content-grid">
            <!-- Trending Pollutants -->
            <div class="card">
              <div class="card-header">
                <h4><i class="fas fa-chart-line"></i> Trending Pollutants</h4>
              </div>
              <div class="card-body">
                @if (!overview.trendingPollutants || overview.trendingPollutants.length === 0) {
                  <div class="empty-state small">
                    <i class="fas fa-check-circle"></i>
                    <p>Air quality is good</p>
                  </div>
                } @else {
                  <div class="pollutants-list">
                    @for (pollutant of overview.trendingPollutants; track pollutant; let i = $index) {
                      <div class="pollutant-item">
                        <div class="pollutant-rank">{{ i + 1 }}</div>
                        <div class="pollutant-name">{{ pollutant }}</div>
                        <div class="pollutant-bar">
                          <div class="bar-fill" [style.width.%]="100 - (i * 20)"></div>
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>

            <!-- Nearest Stations -->
            <div class="card">
              <div class="card-header">
                <h4><i class="fas fa-train"></i> Nearest Stations</h4>
              </div>
              <div class="card-body">
                @if (!overview.nearestStations || overview.nearestStations.length === 0) {
                  <div class="empty-state small">
                    <i class="fas fa-train"></i>
                    <p>No stations nearby</p>
                  </div>
                } @else {
                  <div class="stations-list">
                    @for (station of overview.nearestStations; track station.id) {
                      <div class="station-item">
                        <div class="station-icon">
                          <i class="fas fa-subway"></i>
                        </div>
                        <div class="station-info">
                          <span class="station-name">{{ station.name }}</span>
                          <span class="station-location">
                            <i class="fas fa-map-marker-alt"></i> {{ station.location }}
                          </span>
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>

            <!-- Active Incidents -->
            <div class="card full-width">
              <div class="card-header">
                <h4><i class="fas fa-exclamation-triangle"></i> Active Incidents</h4>
                <span class="incident-count" [ngClass]="{'warning': overview.activeIncidents && overview.activeIncidents.length > 0}">
                  {{ overview.activeIncidents?.length || 0 }} active
                </span>
              </div>
              <div class="card-body">
                @if (!overview.activeIncidents || overview.activeIncidents.length === 0) {
                  <div class="empty-state small success">
                    <i class="fas fa-shield-alt"></i>
                    <p>No active incidents in this zone</p>
                  </div>
                } @else {
                  <div class="incidents-grid">
                    @for (incident of overview.activeIncidents; track incident.id) {
                      <div class="incident-card" [ngClass]="getStatusClass(incident.status)">
                        <div class="incident-header">
                          <span class="incident-type">
                            <i [class]="getIncidentIcon(incident.type)"></i>
                            {{ incident.type }}
                          </span>
                          <span class="incident-status">{{ incident.status }}</span>
                        </div>
                        <div class="incident-location">
                          <i class="fas fa-map-marker-alt"></i> {{ incident.location }}
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 24px; }
    .header-content h2 { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
    .header-content h2 i { color: var(--primary); }
    .page-subtitle { color: var(--gray-500); font-size: 14px; margin: 0; }

    .global-stats-banner {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-item {
      background: white;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .stat-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    }

    .stat-icon-wrapper {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .stat-icon-wrapper.blue { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
    .stat-icon-wrapper.green { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; }
    .stat-icon-wrapper.orange { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; }
    .stat-icon-wrapper.red { background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%); color: white; }

    .stat-content { display: flex; flex-direction: column; }
    .stat-number { font-size: 28px; font-weight: 700; color: var(--gray-800); line-height: 1.2; }
    .stat-text { font-size: 13px; color: var(--gray-500); }

    .zone-selection-section { margin-bottom: 32px; }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 12px;
    }

    .section-header h3 {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 18px;
      color: var(--gray-800);
      margin: 0;
    }

    .section-header h3 i { color: var(--primary); }
    .section-header p { color: var(--gray-500); font-size: 14px; margin: 4px 0 0 28px; }

    .zones-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .zone-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      position: relative;
      overflow: hidden;
    }

    .zone-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.1);
      border-color: var(--primary-light);
    }

    .zone-card.selected {
      border-color: var(--primary);
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.25);
    }

    .zone-card.selected::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .zone-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .zone-card .zone-icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .zone-icon-wrapper.downtown { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
    .zone-icon-wrapper.industrial { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; }
    .zone-icon-wrapper.residential { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; }
    .zone-icon-wrapper.commercial { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; }
    .zone-icon-wrapper.suburban { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; }

    .zone-status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 20px;
      font-weight: 500;
    }

    .zone-status i { font-size: 8px; }
    .zone-status.online { background: #d4edda; color: #155724; }
    .zone-status.warning { background: #fff3cd; color: #856404; }
    .zone-status.offline { background: #f8d7da; color: #721c24; }

    .zone-name { font-size: 18px; font-weight: 600; color: var(--gray-800); margin: 0 0 8px 0; }
    .zone-description { font-size: 13px; color: var(--gray-500); margin: 0 0 16px 0; line-height: 1.5; }

    .zone-quick-stats {
      display: flex;
      gap: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--gray-100);
    }

    .zone-quick-stats span {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: var(--gray-600);
    }

    .zone-quick-stats i { color: var(--gray-400); }

    .zone-loading-overlay {
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 16px;
    }

    .zone-details-section { animation: slideIn 0.3s ease; }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .zone-header-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    .zone-info { display: flex; align-items: center; gap: 20px; }

    .zone-icon-large {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      color: white;
    }

    .zone-info h3 { font-size: 24px; margin: 0 0 4px 0; color: var(--gray-800); }
    .zone-coords { display: flex; align-items: center; gap: 6px; color: var(--gray-500); font-size: 14px; }

    .aqi-display {
      text-align: center;
      padding: 20px 32px;
      border-radius: 16px;
      min-width: 140px;
    }

    .aqi-display.good { background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); }
    .aqi-display.moderate { background: linear-gradient(135deg, #fff3cd 0%, #ffeeba 100%); }
    .aqi-display.unhealthy { background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%); }

    .aqi-value { display: block; font-size: 42px; font-weight: 700; line-height: 1; }
    .aqi-display.good .aqi-value { color: #155724; }
    .aqi-display.moderate .aqi-value { color: #856404; }
    .aqi-display.unhealthy .aqi-value { color: #721c24; }

    .aqi-label { display: block; font-size: 12px; color: var(--gray-500); margin-top: 4px; }

    .aqi-status { display: block; font-size: 14px; font-weight: 600; margin-top: 4px; }
    .aqi-display.good .aqi-status { color: #155724; }
    .aqi-display.moderate .aqi-status { color: #856404; }
    .aqi-display.unhealthy .aqi-status { color: #721c24; }

    .detail-stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .stat-icon.stations { background: #e3f2fd; color: #1976d2; }
    .stat-icon.incidents { background: #fce4ec; color: #c2185b; }
    .stat-icon.pollutants { background: #fff3e0; color: #f57c00; }

    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 24px; font-weight: 700; color: var(--gray-800); }
    .stat-label { font-size: 13px; color: var(--gray-500); }

    .content-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    .card.full-width { grid-column: 1 / -1; }

    .card-header {
      padding: 16px 20px;
      border-bottom: 1px solid var(--gray-100);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-header h4 {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
      font-size: 16px;
      color: var(--gray-800);
    }

    .card-header h4 i { color: var(--primary); }
    .card-body { padding: 20px; }

    .empty-state { text-align: center; padding: 32px; color: var(--gray-400); }
    .empty-state.small { padding: 24px; }
    .empty-state.success { color: #28a745; }
    .empty-state i { font-size: 32px; margin-bottom: 12px; }

    .pollutants-list { display: flex; flex-direction: column; gap: 12px; }

    .pollutant-item { display: flex; align-items: center; gap: 12px; }

    .pollutant-rank {
      width: 24px;
      height: 24px;
      background: var(--gray-100);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      color: var(--gray-600);
    }

    .pollutant-name { width: 60px; font-weight: 500; color: var(--gray-800); }

    .pollutant-bar {
      flex: 1;
      height: 8px;
      background: var(--gray-100);
      border-radius: 4px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .stations-list { display: flex; flex-direction: column; gap: 12px; }

    .station-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: var(--gray-50);
      border-radius: 8px;
    }

    .station-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .station-info { display: flex; flex-direction: column; }
    .station-name { font-weight: 600; color: var(--gray-800); }
    .station-location { font-size: 12px; color: var(--gray-500); }

    .incident-count {
      font-size: 13px;
      padding: 4px 12px;
      border-radius: 20px;
      background: var(--gray-100);
      color: var(--gray-600);
    }

    .incident-count.warning { background: #fce4ec; color: #c2185b; }

    .incidents-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 16px;
    }

    .incident-card {
      padding: 16px;
      border-radius: 10px;
      border-left: 4px solid;
    }

    .incident-card.active { background: #fff5f5; border-color: #e53e3e; }
    .incident-card.responding { background: #fffaf0; border-color: #ed8936; }
    .incident-card.resolved { background: #f0fff4; border-color: #38a169; }

    .incident-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .incident-type {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: var(--gray-800);
    }

    .incident-status {
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 4px;
      background: rgba(0,0,0,0.1);
    }

    .incident-location { font-size: 13px; color: var(--gray-600); }
    .incident-location i { margin-right: 6px; }

    .btn-sm { padding: 8px 16px; font-size: 13px; }
    .spinner.small { width: 24px; height: 24px; }

    @media (max-width: 1200px) {
      .global-stats-banner { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 768px) {
      .global-stats-banner { grid-template-columns: 1fr; }
      .detail-stats-grid { grid-template-columns: 1fr; }
      .content-grid { grid-template-columns: 1fr; }
      .zone-header-card { flex-direction: column; gap: 20px; text-align: center; }
      .zone-info { flex-direction: column; }
    }
  `]
})
export class CityOverviewComponent implements OnInit {
  selectedZoneId = '';
  loadingZoneId = '';
  overview: CityOverview | null = null;
  
  globalStats = {
    avgAQI: 62,
    totalStations: 24,
    activeIncidents: 3
  };

  availableZones: ZoneInfo[] = [
    { 
      id: 'zone1', 
      name: 'Downtown District', 
      description: 'Central business area with high traffic density and commercial activity.',
      icon: 'fas fa-building',
      iconClass: 'downtown',
      status: 'Online',
      statusClass: 'online',
      aqi: 75,
      stations: 6
    },
    { 
      id: 'zone2', 
      name: 'Industrial Zone', 
      description: 'Manufacturing and warehouse district with heavy vehicle traffic.',
      icon: 'fas fa-industry',
      iconClass: 'industrial',
      status: 'Warning',
      statusClass: 'warning',
      aqi: 95,
      stations: 4
    },
    { 
      id: 'zone3', 
      name: 'Residential Area', 
      description: 'Family neighborhoods with schools, parks, and local amenities.',
      icon: 'fas fa-home',
      iconClass: 'residential',
      status: 'Online',
      statusClass: 'online',
      aqi: 45,
      stations: 5
    },
    { 
      id: 'zone4', 
      name: 'Commercial District', 
      description: 'Shopping centers, restaurants, and entertainment venues.',
      icon: 'fas fa-store',
      iconClass: 'commercial',
      status: 'Online',
      statusClass: 'online',
      aqi: 58,
      stations: 5
    },
    { 
      id: 'zone5', 
      name: 'Suburban Area', 
      description: 'Outer city residential areas with lower population density.',
      icon: 'fas fa-tree',
      iconClass: 'suburban',
      status: 'Online',
      statusClass: 'online',
      aqi: 35,
      stations: 4
    }
  ];

  constructor(
    private dataService: DataGraphQLService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.calculateGlobalStats();
  }

  calculateGlobalStats(): void {
    const totalAQI = this.availableZones.reduce((sum, zone) => sum + zone.aqi, 0);
    this.globalStats.avgAQI = Math.round(totalAQI / this.availableZones.length);
    this.globalStats.totalStations = this.availableZones.reduce((sum, zone) => sum + zone.stations, 0);
  }

  selectZone(zoneId: string): void {
    if (this.loadingZoneId) return;
    
    this.selectedZoneId = zoneId;
    this.loadingZoneId = zoneId;
    
    this.dataService.getCityOverview(zoneId).subscribe({
      next: (data) => {
        this.overview = data;
        this.loadingZoneId = '';
        setTimeout(() => {
          document.getElementById('zone-details')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
      error: () => {
        this.toastService.error('Failed to load zone details');
        this.loadingZoneId = '';
      }
    });
  }

  clearSelection(): void {
    this.selectedZoneId = '';
    this.overview = null;
  }

  getAqiClass(aqi: number): string {
    if (aqi <= 50) return 'good';
    if (aqi <= 100) return 'moderate';
    return 'unhealthy';
  }

  getAqiLabel(aqi: number): string {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy (Sensitive)';
    if (aqi <= 200) return 'Unhealthy';
    return 'Very Unhealthy';
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
      default: return 'fas fa-exclamation-triangle';
    }
  }
}
