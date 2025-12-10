import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmergencyService } from '../../../services/emergency.service';
import { EmergencyDashboardStats } from '../../../models/emergency.models';

@Component({
  selector: 'app-emergency-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <div class="page-header">
        <h2>Emergency Dashboard</h2>
        <p class="subtitle">Overview of emergency management system</p>
      </div>

      @if (loading) {
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
      } @else {
        <div class="stats-grid">
          <div class="stat-card emergency">
            <div class="stat-icon">
              <i class="fas fa-exclamation-circle"></i>
            </div>
            <div class="stat-content">
              <h3>{{ stats.events }}</h3>
              <p>Active Events</p>
            </div>
          </div>
          
          <div class="stat-card units">
            <div class="stat-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-content">
              <h3>{{ stats.units }}</h3>
              <p>Emergency Units</p>
            </div>
          </div>
          
          <div class="stat-card resources">
            <div class="stat-icon">
              <i class="fas fa-tools"></i>
            </div>
            <div class="stat-content">
              <h3>{{ stats.resources }}</h3>
              <p>Resources</p>
            </div>
          </div>
          
          <div class="stat-card logs">
            <div class="stat-icon">
              <i class="fas fa-clipboard-list"></i>
            </div>
            <div class="stat-content">
              <h3>{{ stats.logs }}</h3>
              <p>Incident Logs</p>
            </div>
          </div>
        </div>

        <div class="dashboard-grid">
          <div class="card">
            <div class="card-header">
              <h3><i class="fas fa-exclamation-triangle"></i> Critical Events</h3>
              <a routerLink="/emergency/events" class="btn-link">View all →</a>
            </div>
            <div class="card-body">
              @if (stats.criticalEvents.length === 0) {
                <div class="empty-state small">
                  <i class="fas fa-check-circle"></i>
                  <p>No critical events</p>
                </div>
              } @else {
                <ul class="event-list">
                  @for (event of stats.criticalEvents; track event.id) {
                    <li class="event-item">
                      <span class="severity-badge" [ngClass]="getSeverityClass(event.severity)">
                        {{ event.severity }}
                      </span>
                      <span class="event-description">{{ event.description }}</span>
                      <span class="status-badge" [ngClass]="getStatusClass(event.status)">
                        {{ event.status }}
                      </span>
                    </li>
                  }
                </ul>
              }
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3><i class="fas fa-ambulance"></i> Available Units</h3>
              <a routerLink="/emergency/units" class="btn-link">View all →</a>
            </div>
            <div class="card-body">
              @if (stats.availableUnits.length === 0) {
                <div class="empty-state small">
                  <i class="fas fa-user-slash"></i>
                  <p>No available units</p>
                </div>
              } @else {
                <ul class="unit-list">
                  @for (unit of stats.availableUnits; track unit.id) {
                    <li class="unit-item">
                      <i class="fas" [ngClass]="getUnitIcon(unit.type)"></i>
                      <span class="unit-name">{{ unit.name }}</span>
                      <span class="unit-type">{{ unit.type }}</span>
                    </li>
                  }
                </ul>
              }
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <h3>Quick Actions</h3>
          <div class="action-buttons">
            <a routerLink="/emergency/events" class="action-btn">
              <i class="fas fa-plus"></i>
              New Event
            </a>
            <a routerLink="/emergency/units" class="action-btn">
              <i class="fas fa-user-plus"></i>
              Add Unit
            </a>
            <a routerLink="/emergency/resources" class="action-btn">
              <i class="fas fa-toolbox"></i>
              Manage Resources
            </a>
            <a routerLink="/emergency/logs" class="action-btn">
              <i class="fas fa-file-alt"></i>
              View Logs
            </a>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 24px;
    }

    .page-header {
      margin-bottom: 24px;
    }

    .page-header h2 {
      color: var(--gray-900);
      font-size: 28px;
      margin-bottom: 4px;
    }

    .subtitle {
      color: var(--gray-600);
      font-size: 14px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      border: 1px solid var(--gray-200);
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .stat-card.emergency .stat-icon {
      background: #FFE5E5;
      color: #DC2626;
    }

    .stat-card.units .stat-icon {
      background: #E0F2FE;
      color: #0284C7;
    }

    .stat-card.resources .stat-icon {
      background: #FEF3C7;
      color: #D97706;
    }

    .stat-card.logs .stat-icon {
      background: #E0E7FF;
      color: #4F46E5;
    }

    .stat-content h3 {
      font-size: 28px;
      font-weight: 700;
      color: var(--gray-900);
      margin-bottom: 4px;
    }

    .stat-content p {
      color: var(--gray-600);
      font-size: 14px;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      border: 1px solid var(--gray-200);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid var(--gray-200);
    }

    .card-header h3 {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 16px;
      color: var(--gray-800);
    }

    .btn-link {
      color: var(--primary-color);
      font-size: 13px;
      font-weight: 500;
    }

    .btn-link:hover {
      text-decoration: underline;
    }

    .card-body {
      padding: 16px 20px;
    }

    .event-list, .unit-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .event-item, .unit-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid var(--gray-100);
    }

    .event-item:last-child, .unit-item:last-child {
      border-bottom: none;
    }

    .severity-badge {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .severity-badge.critical {
      background: #FEE2E2;
      color: #DC2626;
    }

    .severity-badge.high {
      background: #FED7AA;
      color: #EA580C;
    }

    .severity-badge.medium {
      background: #FEF3C7;
      color: #D97706;
    }

    .severity-badge.low {
      background: #DCFCE7;
      color: #16A34A;
    }

    .status-badge {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      margin-left: auto;
    }

    .status-badge.active, .status-badge.open {
      background: #FEE2E2;
      color: #DC2626;
    }

    .status-badge.resolved, .status-badge.closed {
      background: #DCFCE7;
      color: #16A34A;
    }

    .status-badge.pending {
      background: #FEF3C7;
      color: #D97706;
    }

    .event-description {
      flex: 1;
      color: var(--gray-700);
      font-size: 14px;
    }

    .unit-item i {
      width: 32px;
      height: 32px;
      background: var(--gray-100);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--gray-600);
    }

    .unit-name {
      flex: 1;
      font-weight: 500;
      color: var(--gray-800);
    }

    .unit-type {
      color: var(--gray-500);
      font-size: 13px;
    }

    .empty-state {
      text-align: center;
      padding: 32px;
      color: var(--gray-500);
    }

    .empty-state.small {
      padding: 24px;
    }

    .empty-state i {
      font-size: 32px;
      margin-bottom: 12px;
      color: var(--gray-400);
    }

    .quick-actions {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      border: 1px solid var(--gray-200);
    }

    .quick-actions h3 {
      font-size: 16px;
      color: var(--gray-800);
      margin-bottom: 16px;
    }

    .action-buttons {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background: var(--gray-100);
      border-radius: 8px;
      color: var(--gray-700);
      font-weight: 500;
      transition: all 150ms ease;
    }

    .action-btn:hover {
      background: var(--primary-color);
      color: white;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 60px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--gray-200);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class EmergencyDashboardComponent implements OnInit {
  stats: EmergencyDashboardStats = {
    events: 0,
    units: 0,
    resources: 0,
    logs: 0,
    criticalEvents: [],
    availableUnits: []
  };
  loading = true;

  constructor(private emergencyService: EmergencyService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.emergencyService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getSeverityClass(severity: string): string {
    return severity?.toLowerCase() || 'low';
  }

  getStatusClass(status: string): string {
    return status?.toLowerCase() || 'pending';
  }

  getUnitIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'AMBULANCE': 'fa-ambulance',
      'FIRE': 'fa-fire-extinguisher',
      'POLICE': 'fa-shield-alt',
      'RESCUE': 'fa-life-ring'
    };
    return icons[type?.toUpperCase()] || 'fa-truck';
  }
}
