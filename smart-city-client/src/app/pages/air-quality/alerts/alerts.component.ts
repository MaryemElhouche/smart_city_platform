import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AirQualityService } from '../../../services/air-quality.service';
import { ToastService } from '../../../services/toast.service';
import { Alert, Zone } from '../../../models/air-quality.models';
import { ModalComponent } from '../../../components/modal/modal.component';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <div class="alerts-page">
      <div class="page-header">
        <h2>Air Quality Alerts</h2>
        <div class="page-header-actions">
          <div class="filter-tabs">
            <button class="tab" [class.active]="statusFilter === 'all'" (click)="setStatusFilter('all')">
              All <span class="count">{{ alerts.length }}</span>
            </button>
            <button class="tab" [class.active]="statusFilter === 'active'" (click)="setStatusFilter('active')">
              Active <span class="count alert">{{ getActiveCount() }}</span>
            </button>
            <button class="tab" [class.active]="statusFilter === 'resolved'" (click)="setStatusFilter('resolved')">
              Resolved <span class="count success">{{ getResolvedCount() }}</span>
            </button>
          </div>
          <select class="filter-select" [(ngModel)]="severityFilter" (ngModelChange)="filterAlerts()">
            <option value="">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          <button class="btn btn-primary" (click)="openCreateModal()">
            <i class="fas fa-plus"></i> Create Alert
          </button>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-card critical">
          <div class="stat-icon"><i class="fas fa-exclamation-circle"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ getSeverityCount('CRITICAL') }}</span>
            <span class="stat-label">Critical</span>
          </div>
        </div>
        <div class="stat-card high">
          <div class="stat-icon"><i class="fas fa-exclamation-triangle"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ getSeverityCount('HIGH') }}</span>
            <span class="stat-label">High</span>
          </div>
        </div>
        <div class="stat-card medium">
          <div class="stat-icon"><i class="fas fa-exclamation"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ getSeverityCount('MEDIUM') }}</span>
            <span class="stat-label">Medium</span>
          </div>
        </div>
        <div class="stat-card low">
          <div class="stat-icon"><i class="fas fa-info-circle"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ getSeverityCount('LOW') }}</span>
            <span class="stat-label">Low</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          @if (loading) {
            <div class="loading-spinner">
              <div class="spinner"></div>
            </div>
          } @else if (filteredAlerts.length === 0) {
            <div class="empty-state">
              <i class="fas fa-check-circle"></i>
              <h4>No alerts found</h4>
              <p>{{ statusFilter !== 'all' || severityFilter ? 'No alerts match your criteria' : 'Air quality is good! No active alerts.' }}</p>
            </div>
          } @else {
            <div class="alerts-list">
              @for (alert of filteredAlerts; track alert.id) {
                <div class="alert-card" [class.resolved]="alert.resolved">
                  <div class="alert-severity" [ngClass]="alert.severity?.toLowerCase()">
                    @switch (alert.severity) {
                      @case ('CRITICAL') { <i class="fas fa-exclamation-circle"></i> }
                      @case ('HIGH') { <i class="fas fa-exclamation-triangle"></i> }
                      @case ('MEDIUM') { <i class="fas fa-exclamation"></i> }
                      @default { <i class="fas fa-info-circle"></i> }
                    }
                  </div>
                  <div class="alert-content">
                    <div class="alert-header">
                      <span class="alert-type">{{ alert.type }}</span>
                      <span class="alert-badge" [ngClass]="alert.severity?.toLowerCase()">{{ alert.severity }}</span>
                      @if (alert.resolved) {
                        <span class="resolved-badge"><i class="fas fa-check"></i> Resolved</span>
                      }
                    </div>
                    <p class="alert-description">{{ alert.description }}</p>
                    <div class="alert-meta">
                      <span class="meta-item">
                        <i class="fas fa-map-marker-alt"></i> {{ alert.zone }}
                      </span>
                      <span class="meta-item">
                        <i class="fas fa-chart-bar"></i> {{ alert.metric }}: {{ alert.value }}
                      </span>
                      <span class="meta-item">
                        <i class="fas fa-clock"></i> {{ formatDateTime(alert.createdAt) }}
                      </span>
                      @if (alert.resolved && alert.resolvedAt) {
                        <span class="meta-item resolved-time">
                          <i class="fas fa-check-circle"></i> Resolved: {{ formatDateTime(alert.resolvedAt) }}
                        </span>
                      }
                    </div>
                  </div>
                  <div class="alert-actions">
                    @if (!alert.resolved) {
                      <button class="btn btn-success btn-sm" (click)="resolveAlert(alert)" title="Resolve Alert">
                        <i class="fas fa-check"></i> Resolve
                      </button>
                    }
                    <button class="btn-icon btn-view" (click)="viewAlert(alert)" title="View Details">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon btn-delete" (click)="deleteAlert(alert)" title="Delete">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>

      <!-- Modal -->
      <app-modal 
        [isOpen]="modalOpen" 
        [title]="modalTitle" 
        [viewOnly]="modalMode === 'view'"
        (closed)="closeModal()" 
        (saved)="saveAlert()">
        
        @if (modalMode === 'view') {
          <div class="detail-view">
            <div class="severity-banner" [ngClass]="selectedAlert.severity?.toLowerCase()">
              <i [class]="getSeverityIcon(selectedAlert.severity)"></i>
              <span>{{ selectedAlert.severity }} Alert</span>
              @if (selectedAlert.resolved) {
                <span class="resolved-tag">RESOLVED</span>
              }
            </div>
            <div class="detail-content">
              <div class="detail-item full">
                <span class="detail-label">Type</span>
                <span class="detail-value">{{ selectedAlert.type }}</span>
              </div>
              <div class="detail-item full">
                <span class="detail-label">Description</span>
                <span class="detail-value">{{ selectedAlert.description }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Zone</span>
                <span class="detail-value">{{ selectedAlert.zone }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Metric</span>
                <span class="detail-value">{{ selectedAlert.metric }}: {{ selectedAlert.value }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Created At</span>
                <span class="detail-value">{{ formatDateTime(selectedAlert.createdAt) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Source</span>
                <span class="detail-value">{{ selectedAlert.source || 'System' }}</span>
              </div>
              @if (selectedAlert.resolved && selectedAlert.resolvedAt) {
                <div class="detail-item full">
                  <span class="detail-label">Resolved At</span>
                  <span class="detail-value success">{{ formatDateTime(selectedAlert.resolvedAt) }}</span>
                </div>
              }
            </div>
          </div>
        } @else {
          <div class="form-row">
            <div class="form-group">
              <label for="zone">Zone *</label>
              <select id="zone" [(ngModel)]="selectedAlert.zone" required>
                <option value="">Select zone...</option>
                @for (zone of zones; track zone.id) {
                  <option [value]="zone.name">{{ zone.name }}</option>
                }
              </select>
            </div>
            <div class="form-group">
              <label for="severity">Severity *</label>
              <select id="severity" [(ngModel)]="selectedAlert.severity" required>
                <option value="">Select severity...</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="type">Alert Type *</label>
            <select id="type" [(ngModel)]="selectedAlert.type" required>
              <option value="">Select type...</option>
              <option value="AQI_THRESHOLD">AQI Threshold Exceeded</option>
              <option value="PM25_HIGH">PM2.5 High</option>
              <option value="PM10_HIGH">PM10 High</option>
              <option value="NO2_HIGH">NO₂ High</option>
              <option value="CO2_HIGH">CO₂ High</option>
              <option value="O3_HIGH">O₃ High</option>
              <option value="SENSOR_OFFLINE">Sensor Offline</option>
              <option value="SENSOR_LOW_BATTERY">Sensor Low Battery</option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="metric">Metric</label>
              <select id="metric" [(ngModel)]="selectedAlert.metric">
                <option value="">Select metric...</option>
                <option value="AQI">AQI</option>
                <option value="PM2.5">PM2.5</option>
                <option value="PM10">PM10</option>
                <option value="NO2">NO₂</option>
                <option value="CO2">CO₂</option>
                <option value="O3">O₃</option>
              </select>
            </div>
            <div class="form-group">
              <label for="value">Value</label>
              <input type="number" id="value" [(ngModel)]="selectedAlert.value" placeholder="Measured value">
            </div>
          </div>
          <div class="form-group">
            <label for="description">Description *</label>
            <textarea id="description" [(ngModel)]="selectedAlert.description" rows="3" 
                      placeholder="Describe the alert situation..." required></textarea>
          </div>
          <div class="form-group">
            <label for="source">Source</label>
            <input type="text" id="source" [(ngModel)]="selectedAlert.source" placeholder="e.g., Sensor ID, System">
          </div>
        }
      </app-modal>
    </div>
  `,
  styles: [`
    .filter-tabs {
      display: flex;
      gap: 4px;
      background: var(--gray-100);
      padding: 4px;
      border-radius: 10px;
    }

    .tab {
      padding: 8px 16px;
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      color: var(--gray-600);
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }

    .tab:hover { background: rgba(255,255,255,0.5); }
    .tab.active { background: white; color: var(--primary); box-shadow: 0 2px 4px rgba(0,0,0,0.1); }

    .count {
      background: var(--gray-200);
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 12px;
    }

    .count.alert { background: #fee2e2; color: #dc2626; }
    .count.success { background: #dcfce7; color: #16a34a; }

    .filter-select {
      padding: 10px 16px;
      border: 1px solid var(--gray-200);
      border-radius: 8px;
      font-size: 14px;
      background: white;
      cursor: pointer;
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 20px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      background: white;
      border-radius: 12px;
      border-left: 4px solid;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }

    .stat-card.critical { border-color: #dc2626; }
    .stat-card.critical .stat-icon { background: #fee2e2; color: #dc2626; }
    .stat-card.high { border-color: #ea580c; }
    .stat-card.high .stat-icon { background: #fed7aa; color: #ea580c; }
    .stat-card.medium { border-color: #d97706; }
    .stat-card.medium .stat-icon { background: #fef3c7; color: #d97706; }
    .stat-card.low { border-color: #2563eb; }
    .stat-card.low .stat-icon { background: #dbeafe; color: #2563eb; }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .stat-value { font-size: 28px; font-weight: 700; color: var(--gray-800); }
    .stat-label { font-size: 13px; color: var(--gray-500); }

    .alerts-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .alert-card {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 20px;
      background: white;
      border: 1px solid var(--gray-200);
      border-radius: 12px;
      transition: all 0.2s;
    }

    .alert-card:hover {
      border-color: var(--primary);
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    .alert-card.resolved {
      opacity: 0.7;
      background: var(--gray-50);
    }

    .alert-severity {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }

    .alert-severity.critical { background: #fee2e2; color: #dc2626; }
    .alert-severity.high { background: #fed7aa; color: #ea580c; }
    .alert-severity.medium { background: #fef3c7; color: #d97706; }
    .alert-severity.low { background: #dbeafe; color: #2563eb; }

    .alert-content { flex: 1; }

    .alert-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    .alert-type {
      font-size: 16px;
      font-weight: 600;
      color: var(--gray-800);
    }

    .alert-badge {
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .alert-badge.critical { background: #fee2e2; color: #dc2626; }
    .alert-badge.high { background: #fed7aa; color: #ea580c; }
    .alert-badge.medium { background: #fef3c7; color: #d97706; }
    .alert-badge.low { background: #dbeafe; color: #2563eb; }

    .resolved-badge {
      background: #dcfce7;
      color: #16a34a;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
    }

    .alert-description {
      color: var(--gray-600);
      font-size: 14px;
      margin-bottom: 12px;
      line-height: 1.5;
    }

    .alert-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }

    .meta-item {
      font-size: 13px;
      color: var(--gray-500);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .meta-item i { font-size: 12px; }
    .meta-item.resolved-time { color: #16a34a; }

    .alert-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: flex-end;
    }

    .btn-success {
      background: #16a34a;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .btn-success:hover { background: #15803d; }

    .severity-banner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 20px;
      font-size: 18px;
      font-weight: 600;
    }

    .severity-banner i { font-size: 24px; }

    .severity-banner.critical { background: linear-gradient(135deg, #fee2e2, #fecaca); color: #dc2626; }
    .severity-banner.high { background: linear-gradient(135deg, #fed7aa, #fdba74); color: #ea580c; }
    .severity-banner.medium { background: linear-gradient(135deg, #fef3c7, #fde68a); color: #d97706; }
    .severity-banner.low { background: linear-gradient(135deg, #dbeafe, #bfdbfe); color: #2563eb; }

    .resolved-tag {
      background: #16a34a;
      color: white;
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 12px;
      margin-left: 8px;
    }

    .detail-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .detail-item {
      background: var(--gray-50);
      padding: 12px 16px;
      border-radius: 8px;
    }

    .detail-item.full { grid-column: 1 / -1; }

    .detail-label {
      display: block;
      font-size: 11px;
      color: var(--gray-500);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }

    .detail-value { font-size: 15px; font-weight: 500; color: var(--gray-800); }
    .detail-value.success { color: #16a34a; }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    textarea {
      resize: vertical;
      min-height: 80px;
    }
  `]
})
export class AlertsComponent implements OnInit {
  alerts: Alert[] = [];
  filteredAlerts: Alert[] = [];
  zones: Zone[] = [];
  statusFilter: 'all' | 'active' | 'resolved' = 'all';
  severityFilter = '';
  loading = true;
  modalOpen = false;
  modalMode: 'create' | 'view' = 'create';
  modalTitle = 'New Alert';
  selectedAlert: Alert = this.getEmptyAlert();

  constructor(
    private airQualityService: AirQualityService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadAlerts();
    this.loadZones();
  }

  loadAlerts(): void {
    this.loading = true;
    this.airQualityService.getAlerts().subscribe({
      next: (data) => {
        this.alerts = data;
        this.filterAlerts();
        this.loading = false;
      },
      error: () => {
        this.toastService.error('Failed to load alerts');
        this.loading = false;
      }
    });
  }

  loadZones(): void {
    this.airQualityService.getZones().subscribe({
      next: (data) => this.zones = data
    });
  }

  setStatusFilter(status: 'all' | 'active' | 'resolved'): void {
    this.statusFilter = status;
    this.filterAlerts();
  }

  filterAlerts(): void {
    let filtered = [...this.alerts];
    
    if (this.statusFilter === 'active') {
      filtered = filtered.filter(a => !a.resolved);
    } else if (this.statusFilter === 'resolved') {
      filtered = filtered.filter(a => a.resolved);
    }
    
    if (this.severityFilter) {
      filtered = filtered.filter(a => a.severity === this.severityFilter);
    }
    
    // Sort by created date, newest first
    filtered.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    
    this.filteredAlerts = filtered;
  }

  getActiveCount(): number {
    return this.alerts.filter(a => !a.resolved).length;
  }

  getResolvedCount(): number {
    return this.alerts.filter(a => a.resolved).length;
  }

  getSeverityCount(severity: string): number {
    return this.alerts.filter(a => a.severity === severity && !a.resolved).length;
  }

  getEmptyAlert(): Alert {
    return { zone: '', type: '', severity: 'MEDIUM', resolved: false };
  }

  openCreateModal(): void {
    this.selectedAlert = this.getEmptyAlert();
    this.modalMode = 'create';
    this.modalTitle = 'Create Alert';
    this.modalOpen = true;
  }

  viewAlert(alert: Alert): void {
    this.selectedAlert = { ...alert };
    this.modalMode = 'view';
    this.modalTitle = 'Alert Details';
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selectedAlert = this.getEmptyAlert();
  }

  saveAlert(): void {
    this.airQualityService.createAlert(this.selectedAlert).subscribe({
      next: () => {
        this.toastService.success('Alert created successfully');
        this.loadAlerts();
        this.closeModal();
      },
      error: () => this.toastService.error('Failed to create alert')
    });
  }

  resolveAlert(alert: Alert): void {
    this.airQualityService.resolveAlert(alert.id!).subscribe({
      next: () => {
        this.toastService.success('Alert resolved successfully');
        this.loadAlerts();
      },
      error: () => this.toastService.error('Failed to resolve alert')
    });
  }

  deleteAlert(alert: Alert): void {
    if (confirm('Are you sure you want to delete this alert?')) {
      this.airQualityService.deleteAlert(alert.id!).subscribe({
        next: () => {
          this.toastService.success('Alert deleted successfully');
          this.loadAlerts();
        },
        error: () => this.toastService.error('Failed to delete alert')
      });
    }
  }

  getSeverityIcon(severity?: string): string {
    switch (severity) {
      case 'CRITICAL': return 'fas fa-exclamation-circle';
      case 'HIGH': return 'fas fa-exclamation-triangle';
      case 'MEDIUM': return 'fas fa-exclamation';
      default: return 'fas fa-info-circle';
    }
  }

  formatDateTime(date?: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleString();
  }
}
