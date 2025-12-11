import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AirQualityService } from '../../../services/air-quality.service';
import { AirQualityStats, Alert, Measurement, Sensor } from '../../../models/air-quality.models';

@Component({
  selector: 'app-air-quality-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-page">
      <div class="page-header">
        <h2>Air Quality Dashboard</h2>
        <p class="subtitle">Real-time air quality monitoring and analytics</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card zones">
          <div class="stat-icon">
            <i class="fas fa-map-marked-alt"></i>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.totalZones }}</span>
            <span class="stat-label">Monitored Zones</span>
          </div>
        </div>

        <div class="stat-card sensors">
          <div class="stat-icon">
            <i class="fas fa-broadcast-tower"></i>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.activeSensors }}/{{ stats.totalSensors }}</span>
            <span class="stat-label">Active Sensors</span>
          </div>
        </div>

        <div class="stat-card aqi" [ngClass]="getAqiClass(stats.averageAqi)">
          <div class="stat-icon">
            <i class="fas fa-wind"></i>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.averageAqi }}</span>
            <span class="stat-label">Average AQI</span>
          </div>
        </div>

        <div class="stat-card alerts" [ngClass]="{'warning': stats.unresolvedAlerts > 0}">
          <div class="stat-icon">
            <i class="fas fa-bell"></i>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.unresolvedAlerts }}</span>
            <span class="stat-label">Active Alerts</span>
          </div>
        </div>
      </div>

      <!-- Quick Navigation -->
      <div class="quick-nav">
        <h3>Quick Access</h3>
        <div class="nav-cards">
          <a routerLink="/air-quality/zones" class="nav-card">
            <i class="fas fa-map"></i>
            <span>Zones</span>
            <small>Manage monitoring zones</small>
          </a>
          <a routerLink="/air-quality/sensors" class="nav-card">
            <i class="fas fa-microchip"></i>
            <span>Sensors</span>
            <small>View sensor network</small>
          </a>
          <a routerLink="/air-quality/measurements" class="nav-card">
            <i class="fas fa-chart-line"></i>
            <span>Measurements</span>
            <small>View air quality data</small>
          </a>
          <a routerLink="/air-quality/alerts" class="nav-card">
            <i class="fas fa-exclamation-triangle"></i>
            <span>Alerts</span>
            <small>Manage air quality alerts</small>
          </a>
        </div>
      </div>

      <div class="dashboard-grid">
        <!-- Recent Measurements -->
        <div class="card">
          <div class="card-header">
            <h3><i class="fas fa-chart-area"></i> Recent Measurements</h3>
            <a routerLink="/air-quality/measurements" class="view-all">View All</a>
          </div>
          <div class="card-body">
            @if (recentMeasurements.length === 0) {
              <div class="empty-state">
                <i class="fas fa-chart-line"></i>
                <p>No measurements yet</p>
              </div>
            } @else {
              <div class="measurements-list">
                @for (m of recentMeasurements; track m.id) {
                  <div class="measurement-item">
                    <div class="measurement-zone">
                      <i class="fas fa-map-marker-alt"></i>
                      <span>{{ m.zone }}</span>
                    </div>
                    <div class="measurement-aqi" [ngClass]="getAqiClass(m.aqi)">
                      <span class="aqi-value">{{ m.aqi }}</span>
                      <span class="aqi-label">AQI</span>
                    </div>
                    <div class="measurement-details">
                      <span><i class="fas fa-smog"></i> PM2.5: {{ m.pm25 || '-' }}</span>
                      <span><i class="fas fa-cloud"></i> PM10: {{ m.pm10 || '-' }}</span>
                      <span><i class="fas fa-thermometer-half"></i> {{ m.temperature || '-' }}°C</span>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <!-- Active Alerts -->
        <div class="card">
          <div class="card-header">
            <h3><i class="fas fa-bell"></i> Active Alerts</h3>
            <a routerLink="/air-quality/alerts" class="view-all">View All</a>
          </div>
          <div class="card-body">
            @if (activeAlerts.length === 0) {
              <div class="empty-state success">
                <i class="fas fa-check-circle"></i>
                <p>No active alerts</p>
              </div>
            } @else {
              <div class="alerts-list">
                @for (alert of activeAlerts; track alert.id) {
                  <div class="alert-item" [ngClass]="getSeverityClass(alert.severity)">
                    <div class="alert-icon">
                      <i class="fas fa-exclamation-circle"></i>
                    </div>
                    <div class="alert-content">
                      <span class="alert-type">{{ alert.type }}</span>
                      <span class="alert-zone">{{ alert.zone }}</span>
                      <span class="alert-desc">{{ alert.description || alert.metric + ': ' + alert.value }}</span>
                    </div>
                    <span class="severity-badge" [ngClass]="getSeverityClass(alert.severity)">
                      {{ alert.severity }}
                    </span>
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <!-- Sensor Status -->
        <div class="card full-width">
          <div class="card-header">
            <h3><i class="fas fa-broadcast-tower"></i> Sensor Network Status</h3>
            <a routerLink="/air-quality/sensors" class="view-all">View All</a>
          </div>
          <div class="card-body">
            @if (sensors.length === 0) {
              <div class="empty-state">
                <i class="fas fa-satellite-dish"></i>
                <p>No sensors configured</p>
              </div>
            } @else {
              <div class="sensors-grid">
                @for (sensor of sensors.slice(0, 8); track sensor.id) {
                  <div class="sensor-card" [ngClass]="getSensorStatusClass(sensor.status)">
                    <div class="sensor-status-dot"></div>
                    <div class="sensor-info">
                      <span class="sensor-model">{{ sensor.model }}</span>
                      <span class="sensor-zone">{{ sensor.zone }}</span>
                    </div>
                    <span class="sensor-status">{{ sensor.status }}</span>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>

      <!-- AQI Legend -->
      <div class="aqi-legend">
        <h4>Air Quality Index (AQI) Scale</h4>
        <div class="legend-items">
          <div class="legend-item good">
            <span class="legend-color"></span>
            <span>0-50 Good</span>
          </div>
          <div class="legend-item moderate">
            <span class="legend-color"></span>
            <span>51-100 Moderate</span>
          </div>
          <div class="legend-item unhealthy-sensitive">
            <span class="legend-color"></span>
            <span>101-150 Unhealthy (Sensitive)</span>
          </div>
          <div class="legend-item unhealthy">
            <span class="legend-color"></span>
            <span>151-200 Unhealthy</span>
          </div>
          <div class="legend-item very-unhealthy">
            <span class="legend-color"></span>
            <span>201-300 Very Unhealthy</span>
          </div>
          <div class="legend-item hazardous">
            <span class="legend-color"></span>
            <span>301+ Hazardous</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      padding: 24px;
    }

    .page-header {
      margin-bottom: 24px;
    }

    .page-header h2 {
      font-size: 24px;
      font-weight: 600;
      color: var(--gray-900);
      margin-bottom: 4px;
    }

    .subtitle {
      color: var(--gray-500);
      font-size: 14px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: transform 200ms ease, box-shadow 200ms ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .stat-card.zones .stat-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .stat-card.sensors .stat-icon {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      color: white;
    }

    .stat-card.aqi .stat-icon {
      background: linear-gradient(135deg, #36d1dc 0%, #5b86e5 100%);
      color: white;
    }

    .stat-card.aqi.good .stat-icon {
      background: linear-gradient(135deg, #00b09b 0%, #96c93d 100%);
    }

    .stat-card.aqi.moderate .stat-icon {
      background: linear-gradient(135deg, #f7971e 0%, #ffd200 100%);
    }

    .stat-card.aqi.unhealthy .stat-icon {
      background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
    }

    .stat-card.alerts .stat-icon {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
    }

    .stat-card.alerts.warning .stat-icon {
      background: linear-gradient(135deg, #f5af19 0%, #f12711 100%);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: var(--gray-900);
    }

    .stat-label {
      font-size: 13px;
      color: var(--gray-500);
      font-weight: 500;
    }

    .quick-nav {
      margin-bottom: 24px;
    }

    .quick-nav h3 {
      font-size: 16px;
      font-weight: 600;
      color: var(--gray-700);
      margin-bottom: 12px;
    }

    .nav-cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    .nav-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: all 200ms ease;
      text-decoration: none;
      border: 2px solid transparent;
    }

    .nav-card:hover {
      border-color: var(--primary);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .nav-card i {
      font-size: 32px;
      color: var(--primary);
    }

    .nav-card span {
      font-size: 16px;
      font-weight: 600;
      color: var(--gray-800);
    }

    .nav-card small {
      font-size: 12px;
      color: var(--gray-500);
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }

    .card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .card.full-width {
      grid-column: 1 / -1;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid var(--gray-100);
    }

    .card-header h3 {
      font-size: 16px;
      font-weight: 600;
      color: var(--gray-800);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .card-header h3 i {
      color: var(--primary);
    }

    .view-all {
      font-size: 13px;
      color: var(--primary);
      font-weight: 500;
    }

    .card-body {
      padding: 16px 20px;
    }

    .empty-state {
      text-align: center;
      padding: 32px;
      color: var(--gray-400);
    }

    .empty-state i {
      font-size: 48px;
      margin-bottom: 12px;
    }

    .empty-state.success {
      color: #16a34a;
    }

    .measurements-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .measurement-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px;
      background: var(--gray-50);
      border-radius: 10px;
    }

    .measurement-zone {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 120px;
      font-weight: 500;
      color: var(--gray-700);
    }

    .measurement-zone i {
      color: var(--primary);
    }

    .measurement-aqi {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 16px;
      border-radius: 8px;
      min-width: 70px;
    }

    .measurement-aqi.good {
      background: #dcfce7;
      color: #16a34a;
    }

    .measurement-aqi.moderate {
      background: #fef3c7;
      color: #d97706;
    }

    .measurement-aqi.unhealthy {
      background: #fee2e2;
      color: #dc2626;
    }

    .aqi-value {
      font-size: 20px;
      font-weight: 700;
    }

    .aqi-label {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .measurement-details {
      display: flex;
      gap: 16px;
      font-size: 13px;
      color: var(--gray-600);
    }

    .measurement-details span {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .measurement-details i {
      font-size: 11px;
      color: var(--gray-400);
    }

    .alerts-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .alert-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 10px;
      background: var(--gray-50);
      border-left: 4px solid;
    }

    .alert-item.critical {
      border-left-color: #dc2626;
      background: #fef2f2;
    }

    .alert-item.high {
      border-left-color: #ea580c;
      background: #fff7ed;
    }

    .alert-item.medium {
      border-left-color: #d97706;
      background: #fffbeb;
    }

    .alert-item.low {
      border-left-color: #16a34a;
      background: #f0fdf4;
    }

    .alert-icon {
      font-size: 20px;
    }

    .alert-item.critical .alert-icon { color: #dc2626; }
    .alert-item.high .alert-icon { color: #ea580c; }
    .alert-item.medium .alert-icon { color: #d97706; }
    .alert-item.low .alert-icon { color: #16a34a; }

    .alert-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .alert-type {
      font-weight: 600;
      color: var(--gray-800);
      font-size: 14px;
    }

    .alert-zone {
      font-size: 12px;
      color: var(--gray-500);
    }

    .alert-desc {
      font-size: 12px;
      color: var(--gray-600);
    }

    .severity-badge {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .severity-badge.critical {
      background: #fee2e2;
      color: #dc2626;
    }

    .severity-badge.high {
      background: #fed7aa;
      color: #ea580c;
    }

    .severity-badge.medium {
      background: #fef3c7;
      color: #d97706;
    }

    .severity-badge.low {
      background: #dcfce7;
      color: #16a34a;
    }

    .sensors-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }

    .sensor-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: var(--gray-50);
      border-radius: 10px;
      border-left: 4px solid;
    }

    .sensor-card.active {
      border-left-color: #16a34a;
    }

    .sensor-card.inactive, .sensor-card.offline {
      border-left-color: #dc2626;
    }

    .sensor-card.maintenance {
      border-left-color: #d97706;
    }

    .sensor-status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .sensor-card.active .sensor-status-dot {
      background: #16a34a;
      box-shadow: 0 0 8px #16a34a;
    }

    .sensor-card.inactive .sensor-status-dot,
    .sensor-card.offline .sensor-status-dot {
      background: #dc2626;
    }

    .sensor-card.maintenance .sensor-status-dot {
      background: #d97706;
    }

    .sensor-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .sensor-model {
      font-weight: 600;
      color: var(--gray-800);
      font-size: 13px;
    }

    .sensor-zone {
      font-size: 11px;
      color: var(--gray-500);
    }

    .sensor-status {
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      color: var(--gray-600);
    }

    .aqi-legend {
      background: white;
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .aqi-legend h4 {
      font-size: 14px;
      font-weight: 600;
      color: var(--gray-700);
      margin-bottom: 12px;
    }

    .legend-items {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--gray-600);
    }

    .legend-color {
      width: 20px;
      height: 20px;
      border-radius: 4px;
    }

    .legend-item.good .legend-color { background: #00e400; }
    .legend-item.moderate .legend-color { background: #ffff00; }
    .legend-item.unhealthy-sensitive .legend-color { background: #ff7e00; }
    .legend-item.unhealthy .legend-color { background: #ff0000; }
    .legend-item.very-unhealthy .legend-color { background: #8f3f97; }
    .legend-item.hazardous .legend-color { background: #7e0023; }

    @media (max-width: 1200px) {
      .stats-grid, .nav-cards {
        grid-template-columns: repeat(2, 1fr);
      }
      .sensors-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .stats-grid, .nav-cards, .dashboard-grid {
        grid-template-columns: 1fr;
      }
      .sensors-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AirQualityDashboardComponent implements OnInit {
  stats: AirQualityStats = {
    totalZones: 0,
    totalSensors: 0,
    activeSensors: 0,
    totalMeasurements: 0,
    unresolvedAlerts: 0,
    averageAqi: 0
  };

  recentMeasurements: Measurement[] = [];
  activeAlerts: Alert[] = [];
  sensors: Sensor[] = [];

  constructor(private airQualityService: AirQualityService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.airQualityService.getDashboardStats().subscribe({
      next: (stats) => this.stats = stats
    });

    this.airQualityService.getMeasurements().subscribe({
      next: (measurements) => this.recentMeasurements = measurements.slice(0, 5)
    });

    this.airQualityService.getUnresolvedAlerts().subscribe({
      next: (alerts) => this.activeAlerts = alerts.slice(0, 5)
    });

    this.airQualityService.getSensors().subscribe({
      next: (sensors) => this.sensors = sensors
    });
  }

  getAqiClass(aqi: number): string {
    if (aqi <= 50) return 'good';
    if (aqi <= 100) return 'moderate';
    if (aqi <= 150) return 'unhealthy-sensitive';
    if (aqi <= 200) return 'unhealthy';
    if (aqi <= 300) return 'very-unhealthy';
    return 'hazardous';
  }

  getSeverityClass(severity: string): string {
    return severity?.toLowerCase() || 'low';
  }

  getSensorStatusClass(status: string): string {
    return status?.toLowerCase() || 'inactive';
  }
}
