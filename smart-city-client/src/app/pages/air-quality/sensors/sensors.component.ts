import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AirQualityService } from '../../../services/air-quality.service';
import { ToastService } from '../../../services/toast.service';
import { Sensor, Zone } from '../../../models/air-quality.models';
import { ModalComponent } from '../../../components/modal/modal.component';

@Component({
  selector: 'app-sensors',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <div class="sensors-page">
      <div class="page-header">
        <h2>Sensor Network</h2>
        <div class="page-header-actions">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="filterSensors()" placeholder="Search sensors...">
          </div>
          <select class="filter-select" [(ngModel)]="statusFilter" (ngModelChange)="filterSensors()">
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
          <button class="btn btn-secondary" (click)="loadSensors()">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
          <button class="btn btn-primary" (click)="openCreateModal()">
            <i class="fas fa-plus"></i> New Sensor
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-item active">
          <i class="fas fa-check-circle"></i>
          <span class="stat-value">{{ getStatusCount('ACTIVE') }}</span>
          <span class="stat-label">Active</span>
        </div>
        <div class="stat-item inactive">
          <i class="fas fa-times-circle"></i>
          <span class="stat-value">{{ getStatusCount('INACTIVE') }}</span>
          <span class="stat-label">Inactive</span>
        </div>
        <div class="stat-item maintenance">
          <i class="fas fa-wrench"></i>
          <span class="stat-value">{{ getStatusCount('MAINTENANCE') }}</span>
          <span class="stat-label">Maintenance</span>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          @if (loading) {
            <div class="loading-spinner">
              <div class="spinner"></div>
            </div>
          } @else if (filteredSensors.length === 0) {
            <div class="empty-state">
              <i class="fas fa-broadcast-tower"></i>
              <h4>No sensors found</h4>
              <p>{{ searchTerm || statusFilter ? 'No sensors match your criteria' : 'Deploy your first sensor to get started' }}</p>
            </div>
          } @else {
            <table class="data-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Model</th>
                  <th>Zone</th>
                  <th>Manufacturer</th>
                  <th>Location</th>
                  <th>Last Calibration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (sensor of filteredSensors; track sensor.id) {
                  <tr>
                    <td>
                      <div class="status-indicator" [ngClass]="getStatusClass(sensor.status)">
                        <span class="status-dot"></span>
                        <span>{{ sensor.status }}</span>
                      </div>
                    </td>
                    <td>
                      <div class="sensor-model">
                        <i class="fas fa-microchip"></i>
                        <span>{{ sensor.model }}</span>
                      </div>
                    </td>
                    <td>{{ sensor.zone }}</td>
                    <td>{{ sensor.manufacturer || '-' }}</td>
                    <td>
                      @if (sensor.latitude && sensor.longitude) {
                        <span class="location-badge">
                          <i class="fas fa-map-marker-alt"></i>
                          {{ sensor.latitude?.toFixed(4) }}, {{ sensor.longitude?.toFixed(4) }}
                        </span>
                      } @else {
                        -
                      }
                    </td>
                    <td>{{ formatDate(sensor.lastCalibration) }}</td>
                    <td>
                      <div class="action-buttons">
                        <button class="btn-icon btn-view" (click)="viewSensor(sensor)" title="View">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon btn-edit" (click)="editSensor(sensor)" title="Edit">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-delete" (click)="deleteSensor(sensor)" title="Delete">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          }
        </div>
      </div>

      <!-- Modal -->
      <app-modal 
        [isOpen]="modalOpen" 
        [title]="modalTitle" 
        [viewOnly]="modalMode === 'view'"
        (closed)="closeModal()" 
        (saved)="saveSensor()">
        
        @if (modalMode === 'view') {
          <div class="detail-view">
            <div class="detail-row"><strong>ID:</strong> {{ selectedSensor.id }}</div>
            <div class="detail-row"><strong>Model:</strong> {{ selectedSensor.model }}</div>
            <div class="detail-row"><strong>Status:</strong>
              <span class="status-badge" [ngClass]="getStatusClass(selectedSensor.status)">
                {{ selectedSensor.status }}
              </span>
            </div>
            <div class="detail-row"><strong>Zone:</strong> {{ selectedSensor.zone }}</div>
            <div class="detail-row"><strong>Manufacturer:</strong> {{ selectedSensor.manufacturer || '-' }}</div>
            <div class="detail-row"><strong>Firmware:</strong> {{ selectedSensor.firmwareVersion || '-' }}</div>
            <div class="detail-row"><strong>IP Address:</strong> {{ selectedSensor.ipAddress || '-' }}</div>
            <div class="detail-row"><strong>Location:</strong> 
              {{ selectedSensor.latitude?.toFixed(6) || '-' }}, {{ selectedSensor.longitude?.toFixed(6) || '-' }}
            </div>
            <div class="detail-row"><strong>Installed:</strong> {{ formatDate(selectedSensor.installedAt) }}</div>
            <div class="detail-row"><strong>Last Calibration:</strong> {{ formatDate(selectedSensor.lastCalibration) }}</div>
          </div>
        } @else {
          <div class="form-group">
            <label for="model">Sensor Model *</label>
            <input type="text" id="model" [(ngModel)]="selectedSensor.model" placeholder="e.g., AQ-2000 Pro" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="zone">Zone *</label>
              <select id="zone" [(ngModel)]="selectedSensor.zone" required>
                <option value="">Select zone...</option>
                @for (zone of zones; track zone.id) {
                  <option [value]="zone.name">{{ zone.name }}</option>
                }
              </select>
            </div>
            <div class="form-group">
              <label for="status">Status *</label>
              <select id="status" [(ngModel)]="selectedSensor.status" required>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="manufacturer">Manufacturer</label>
              <input type="text" id="manufacturer" [(ngModel)]="selectedSensor.manufacturer" placeholder="e.g., EnviroTech">
            </div>
            <div class="form-group">
              <label for="firmware">Firmware Version</label>
              <input type="text" id="firmware" [(ngModel)]="selectedSensor.firmwareVersion" placeholder="e.g., v2.1.4">
            </div>
          </div>
          <div class="form-section">
            <h4>Location</h4>
            <div class="form-row">
              <div class="form-group">
                <label for="latitude">Latitude</label>
                <input type="number" id="latitude" [(ngModel)]="selectedSensor.latitude" placeholder="0.0" step="0.000001">
              </div>
              <div class="form-group">
                <label for="longitude">Longitude</label>
                <input type="number" id="longitude" [(ngModel)]="selectedSensor.longitude" placeholder="0.0" step="0.000001">
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="ipAddress">IP Address</label>
            <input type="text" id="ipAddress" [(ngModel)]="selectedSensor.ipAddress" placeholder="e.g., 192.168.1.100">
          </div>
        }
      </app-modal>
    </div>
  `,
  styles: [`
    .stats-row {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 12px;
      background: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .stat-item i {
      font-size: 24px;
    }

    .stat-item.active { border-left: 4px solid #16a34a; }
    .stat-item.active i { color: #16a34a; }

    .stat-item.inactive { border-left: 4px solid #dc2626; }
    .stat-item.inactive i { color: #dc2626; }

    .stat-item.maintenance { border-left: 4px solid #d97706; }
    .stat-item.maintenance i { color: #d97706; }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: var(--gray-900);
    }

    .stat-label {
      font-size: 13px;
      color: var(--gray-500);
    }

    .filter-select {
      padding: 10px 16px;
      border: 1px solid var(--gray-200);
      border-radius: 8px;
      font-size: 14px;
      background: white;
      cursor: pointer;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 500;
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .status-indicator.active .status-dot {
      background: #16a34a;
      box-shadow: 0 0 8px #16a34a;
    }
    .status-indicator.active { color: #16a34a; }

    .status-indicator.inactive .status-dot { background: #dc2626; }
    .status-indicator.inactive { color: #dc2626; }

    .status-indicator.maintenance .status-dot { background: #d97706; }
    .status-indicator.maintenance { color: #d97706; }

    .sensor-model {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }

    .sensor-model i {
      color: var(--primary);
    }

    .location-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: var(--gray-600);
      background: var(--gray-100);
      padding: 4px 8px;
      border-radius: 4px;
    }

    .location-badge i {
      color: var(--primary);
      font-size: 10px;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.active {
      background: #dcfce7;
      color: #16a34a;
    }

    .status-badge.inactive {
      background: #fee2e2;
      color: #dc2626;
    }

    .status-badge.maintenance {
      background: #fef3c7;
      color: #d97706;
    }

    .form-section {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--gray-200);
    }

    .form-section h4 {
      font-size: 14px;
      color: var(--gray-700);
      margin-bottom: 12px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
  `]
})
export class SensorsComponent implements OnInit {
  sensors: Sensor[] = [];
  filteredSensors: Sensor[] = [];
  zones: Zone[] = [];
  searchTerm = '';
  statusFilter = '';
  loading = true;
  modalOpen = false;
  modalMode: 'create' | 'edit' | 'view' = 'create';
  modalTitle = 'New Sensor';
  selectedSensor: Sensor = this.getEmptySensor();

  constructor(
    private airQualityService: AirQualityService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadSensors();
    this.loadZones();
  }

  loadSensors(): void {
    this.loading = true;
    this.airQualityService.getSensors().subscribe({
      next: (data) => {
        this.sensors = data;
        this.filterSensors();
        this.loading = false;
      },
      error: () => {
        this.toastService.error('Failed to load sensors');
        this.loading = false;
      }
    });
  }

  loadZones(): void {
    this.airQualityService.getZones().subscribe({
      next: (data) => this.zones = data
    });
  }

  filterSensors(): void {
    let filtered = [...this.sensors];
    
    if (this.statusFilter) {
      filtered = filtered.filter(s => s.status?.toUpperCase() === this.statusFilter);
    }
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.model?.toLowerCase().includes(term) ||
        s.zone?.toLowerCase().includes(term) ||
        s.manufacturer?.toLowerCase().includes(term)
      );
    }
    
    this.filteredSensors = filtered;
  }

  getEmptySensor(): Sensor {
    return { zone: '', model: '', status: 'ACTIVE' };
  }

  getStatusCount(status: string): number {
    return this.sensors.filter(s => s.status?.toUpperCase() === status).length;
  }

  openCreateModal(): void {
    this.selectedSensor = this.getEmptySensor();
    this.modalMode = 'create';
    this.modalTitle = 'New Sensor';
    this.modalOpen = true;
  }

  viewSensor(sensor: Sensor): void {
    this.selectedSensor = { ...sensor };
    this.modalMode = 'view';
    this.modalTitle = 'Sensor Details';
    this.modalOpen = true;
  }

  editSensor(sensor: Sensor): void {
    this.selectedSensor = { ...sensor };
    this.modalMode = 'edit';
    this.modalTitle = 'Edit Sensor';
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selectedSensor = this.getEmptySensor();
  }

  saveSensor(): void {
    if (this.modalMode === 'edit' && this.selectedSensor.id) {
      this.airQualityService.updateSensor(this.selectedSensor.id, this.selectedSensor).subscribe({
        next: () => {
          this.toastService.success('Sensor updated successfully');
          this.loadSensors();
          this.closeModal();
        },
        error: () => this.toastService.error('Failed to update sensor')
      });
    } else {
      this.airQualityService.createSensor(this.selectedSensor).subscribe({
        next: () => {
          this.toastService.success('Sensor created successfully');
          this.loadSensors();
          this.closeModal();
        },
        error: () => this.toastService.error('Failed to create sensor')
      });
    }
  }

  deleteSensor(sensor: Sensor): void {
    if (confirm(`Are you sure you want to delete sensor "${sensor.model}"?`)) {
      this.airQualityService.deleteSensor(sensor.id!).subscribe({
        next: () => {
          this.toastService.success('Sensor deleted successfully');
          this.loadSensors();
        },
        error: () => this.toastService.error('Failed to delete sensor')
      });
    }
  }

  getStatusClass(status: string): string {
    return status?.toLowerCase() || 'inactive';
  }

  formatDate(date?: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  }
}
