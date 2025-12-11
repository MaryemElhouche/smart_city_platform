import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataGraphQLService } from '../../../services/data-graphql.service';
import { ToastService } from '../../../services/toast.service';
import { IncidentSummary } from '../../../models/data.models';
import { ModalComponent } from '../../../components/modal/modal.component';

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <div class="incidents-page">
      <div class="page-header">
        <h2>Incident Summaries</h2>
        <div class="page-header-actions">
          <div class="filter-tabs">
            <button class="tab" [class.active]="statusFilter === 'all'" (click)="setStatusFilter('all')">
              All <span class="count">{{ incidents.length }}</span>
            </button>
            <button class="tab" [class.active]="statusFilter === 'active'" (click)="setStatusFilter('active')">
              Active <span class="count warning">{{ getActiveCount() }}</span>
            </button>
            <button class="tab" [class.active]="statusFilter === 'responding'" (click)="setStatusFilter('responding')">
              Responding <span class="count info">{{ getRespondingCount() }}</span>
            </button>
            <button class="tab" [class.active]="statusFilter === 'resolved'" (click)="setStatusFilter('resolved')">
              Resolved <span class="count success">{{ getResolvedCount() }}</span>
            </button>
          </div>
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="filterIncidents()" placeholder="Search incidents...">
          </div>
          <button class="btn btn-secondary" (click)="loadIncidents()">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-card total">
          <div class="stat-icon"><i class="fas fa-clipboard-list"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ incidents.length }}</span>
            <span class="stat-label">Total Incidents</span>
          </div>
        </div>
        <div class="stat-card active">
          <div class="stat-icon"><i class="fas fa-exclamation-circle"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ getActiveCount() }}</span>
            <span class="stat-label">Active</span>
          </div>
        </div>
        <div class="stat-card responding">
          <div class="stat-icon"><i class="fas fa-truck"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ getRespondingCount() }}</span>
            <span class="stat-label">Responding</span>
          </div>
        </div>
        <div class="stat-card resolved">
          <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ getResolvedCount() }}</span>
            <span class="stat-label">Resolved</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          @if (loading) {
            <div class="loading-spinner">
              <div class="spinner"></div>
            </div>
          } @else if (filteredIncidents.length === 0) {
            <div class="empty-state">
              <i class="fas fa-clipboard-check"></i>
              <h4>No incidents found</h4>
              <p>{{ searchTerm || statusFilter !== 'all' ? 'No incidents match your criteria' : 'No incident records available' }}</p>
            </div>
          } @else {
            <div class="incidents-grid">
              @for (incident of filteredIncidents; track incident.id) {
                <div class="incident-card" [ngClass]="getStatusClass(incident.status)" (click)="viewIncident(incident)">
                  <div class="incident-header">
                    <div class="incident-type-icon" [ngClass]="getTypeClass(incident.type)">
                      <i [class]="getIncidentIcon(incident.type)"></i>
                    </div>
                    <div class="incident-main">
                      <span class="incident-type">{{ incident.type }}</span>
                      <span class="incident-id">#{{ incident.id?.substring(0, 8) || 'N/A' }}</span>
                    </div>
                    <span class="status-badge" [ngClass]="getStatusClass(incident.status)">
                      {{ incident.status }}
                    </span>
                  </div>
                  <div class="incident-body">
                    <div class="incident-location">
                      <i class="fas fa-map-marker-alt"></i>
                      <span>{{ incident.location }}</span>
                    </div>
                    @if (incident.etaOfUnit) {
                      <div class="incident-eta">
                        <i class="fas fa-clock"></i>
                        <span>ETA: {{ incident.etaOfUnit }}</span>
                      </div>
                    }
                  </div>
                  <div class="incident-footer">
                    <button class="btn-view">
                      <i class="fas fa-eye"></i> View Details
                    </button>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>

      <!-- View Modal -->
      <app-modal 
        [isOpen]="modalOpen" 
        [title]="'Incident Details'" 
        [viewOnly]="true"
        (closed)="closeModal()">
        
        @if (selectedIncident) {
          <div class="detail-view">
            <div class="detail-header" [ngClass]="getStatusClass(selectedIncident.status)">
              <div class="detail-icon">
                <i [class]="getIncidentIcon(selectedIncident.type)"></i>
              </div>
              <div class="detail-title">
                <span class="incident-type-large">{{ selectedIncident.type }}</span>
                <span class="incident-id-large">#{{ selectedIncident.id }}</span>
              </div>
              <span class="status-badge-large" [ngClass]="getStatusClass(selectedIncident.status)">
                {{ selectedIncident.status }}
              </span>
            </div>
            
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">Location</span>
                <span class="detail-value">
                  <i class="fas fa-map-marker-alt"></i>
                  {{ selectedIncident.location }}
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Status</span>
                <span class="detail-value">
                  <span class="status-dot" [ngClass]="getStatusClass(selectedIncident.status)"></span>
                  {{ selectedIncident.status }}
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Incident Type</span>
                <span class="detail-value">{{ selectedIncident.type }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">ETA of Unit</span>
                <span class="detail-value">{{ selectedIncident.etaOfUnit || 'Not assigned' }}</span>
              </div>
            </div>

            <div class="timeline">
              <h5>Incident Timeline</h5>
              <div class="timeline-items">
                <div class="timeline-item completed">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <span class="timeline-title">Incident Reported</span>
                    <span class="timeline-time">Initial report received</span>
                  </div>
                </div>
                @if (selectedIncident.status !== 'ACTIVE') {
                  <div class="timeline-item completed">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                      <span class="timeline-title">Unit Dispatched</span>
                      <span class="timeline-time">Response team assigned</span>
                    </div>
                  </div>
                }
                @if (selectedIncident.status === 'RESOLVED') {
                  <div class="timeline-item completed">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                      <span class="timeline-title">Incident Resolved</span>
                      <span class="timeline-time">Successfully handled</span>
                    </div>
                  </div>
                }
              </div>
            </div>
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

    .count.warning { background: #fee2e2; color: #dc2626; }
    .count.info { background: #fef3c7; color: #d97706; }
    .count.success { background: #dcfce7; color: #16a34a; }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: white;
      border-radius: 12px;
      border-left: 4px solid;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }

    .stat-card.total { border-color: #6366f1; }
    .stat-card.total .stat-icon { background: #eef2ff; color: #6366f1; }
    .stat-card.active { border-color: #dc2626; }
    .stat-card.active .stat-icon { background: #fee2e2; color: #dc2626; }
    .stat-card.responding { border-color: #d97706; }
    .stat-card.responding .stat-icon { background: #fef3c7; color: #d97706; }
    .stat-card.resolved { border-color: #16a34a; }
    .stat-card.resolved .stat-icon { background: #dcfce7; color: #16a34a; }

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

    .incidents-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
    }

    .incident-card {
      background: white;
      border: 1px solid var(--gray-200);
      border-radius: 12px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.2s;
      border-left: 4px solid;
    }

    .incident-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      transform: translateY(-2px);
    }

    .incident-card.active { border-left-color: #dc2626; }
    .incident-card.responding { border-left-color: #d97706; }
    .incident-card.resolved { border-left-color: #16a34a; opacity: 0.8; }

    .incident-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .incident-type-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .incident-type-icon.fire { background: #fee2e2; color: #dc2626; }
    .incident-type-icon.accident { background: #fef3c7; color: #d97706; }
    .incident-type-icon.medical { background: #dbeafe; color: #2563eb; }
    .incident-type-icon.crime { background: #f3e8ff; color: #9333ea; }
    .incident-type-icon.default { background: var(--gray-100); color: var(--gray-600); }

    .incident-main {
      flex: 1;
    }

    .incident-type {
      display: block;
      font-size: 16px;
      font-weight: 600;
      color: var(--gray-800);
    }

    .incident-id {
      font-size: 12px;
      color: var(--gray-400);
      font-family: monospace;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.active { background: #fee2e2; color: #dc2626; }
    .status-badge.responding { background: #fef3c7; color: #d97706; }
    .status-badge.resolved { background: #dcfce7; color: #16a34a; }

    .incident-body {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
    }

    .incident-location, .incident-eta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: var(--gray-600);
    }

    .incident-location i { color: var(--primary); }
    .incident-eta i { color: #d97706; }

    .incident-footer {
      border-top: 1px solid var(--gray-100);
      padding-top: 12px;
    }

    .btn-view {
      width: 100%;
      padding: 10px;
      background: var(--gray-50);
      border: 1px solid var(--gray-200);
      border-radius: 8px;
      color: var(--gray-600);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn-view:hover {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    .detail-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px;
      border-radius: 12px;
      margin-bottom: 24px;
    }

    .detail-header.active { background: linear-gradient(135deg, #fee2e2, #fecaca); }
    .detail-header.responding { background: linear-gradient(135deg, #fef3c7, #fde68a); }
    .detail-header.resolved { background: linear-gradient(135deg, #dcfce7, #bbf7d0); }

    .detail-icon {
      width: 56px;
      height: 56px;
      background: rgba(255,255,255,0.8);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .detail-title {
      flex: 1;
    }

    .incident-type-large {
      display: block;
      font-size: 20px;
      font-weight: 700;
      color: var(--gray-800);
    }

    .incident-id-large {
      font-size: 13px;
      color: var(--gray-500);
      font-family: monospace;
    }

    .status-badge-large {
      padding: 8px 20px;
      border-radius: 24px;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .detail-item {
      background: var(--gray-50);
      padding: 16px;
      border-radius: 10px;
    }

    .detail-label {
      display: block;
      font-size: 11px;
      color: var(--gray-500);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }

    .detail-value {
      font-size: 15px;
      font-weight: 500;
      color: var(--gray-800);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .detail-value i { color: var(--primary); }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .status-dot.active { background: #dc2626; }
    .status-dot.responding { background: #d97706; }
    .status-dot.resolved { background: #16a34a; }

    .timeline {
      border-top: 1px solid var(--gray-100);
      padding-top: 20px;
    }

    .timeline h5 {
      font-size: 14px;
      font-weight: 600;
      color: var(--gray-700);
      margin-bottom: 16px;
    }

    .timeline-items {
      display: flex;
      flex-direction: column;
      gap: 16px;
      position: relative;
      padding-left: 24px;
    }

    .timeline-items::before {
      content: '';
      position: absolute;
      left: 7px;
      top: 8px;
      bottom: 8px;
      width: 2px;
      background: var(--gray-200);
    }

    .timeline-item {
      position: relative;
    }

    .timeline-dot {
      position: absolute;
      left: -24px;
      top: 4px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--gray-200);
      border: 3px solid white;
    }

    .timeline-item.completed .timeline-dot {
      background: #16a34a;
    }

    .timeline-title {
      display: block;
      font-weight: 500;
      color: var(--gray-800);
      font-size: 14px;
    }

    .timeline-time {
      font-size: 12px;
      color: var(--gray-500);
    }

    @media (max-width: 768px) {
      .stats-row { grid-template-columns: repeat(2, 1fr); }
      .incidents-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class IncidentsComponent implements OnInit {
  incidents: IncidentSummary[] = [];
  filteredIncidents: IncidentSummary[] = [];
  statusFilter: 'all' | 'active' | 'responding' | 'resolved' = 'all';
  searchTerm = '';
  loading = true;
  modalOpen = false;
  selectedIncident: IncidentSummary | null = null;

  constructor(
    private dataService: DataGraphQLService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadIncidents();
  }

  loadIncidents(): void {
    this.loading = true;
    this.dataService.getAllIncidents().subscribe({
      next: (data) => {
        this.incidents = data;
        this.filterIncidents();
        this.loading = false;
      },
      error: () => {
        this.toastService.error('Failed to load incidents');
        this.loading = false;
      }
    });
  }

  setStatusFilter(status: 'all' | 'active' | 'responding' | 'resolved'): void {
    this.statusFilter = status;
    this.filterIncidents();
  }

  filterIncidents(): void {
    let filtered = [...this.incidents];
    
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(i => i.status?.toLowerCase() === this.statusFilter);
    }
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(i => 
        i.type?.toLowerCase().includes(term) ||
        i.location?.toLowerCase().includes(term) ||
        i.id?.toLowerCase().includes(term)
      );
    }
    
    this.filteredIncidents = filtered;
  }

  getActiveCount(): number {
    return this.incidents.filter(i => i.status?.toUpperCase() === 'ACTIVE').length;
  }

  getRespondingCount(): number {
    return this.incidents.filter(i => i.status?.toUpperCase() === 'RESPONDING').length;
  }

  getResolvedCount(): number {
    return this.incidents.filter(i => i.status?.toUpperCase() === 'RESOLVED').length;
  }

  viewIncident(incident: IncidentSummary): void {
    this.selectedIncident = incident;
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selectedIncident = null;
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'ACTIVE': return 'active';
      case 'RESPONDING': return 'responding';
      case 'RESOLVED': return 'resolved';
      default: return 'active';
    }
  }

  getTypeClass(type: string): string {
    switch (type?.toUpperCase()) {
      case 'FIRE': return 'fire';
      case 'ACCIDENT': return 'accident';
      case 'MEDICAL': return 'medical';
      case 'CRIME': return 'crime';
      default: return 'default';
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
