import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AirQualityService } from '../../../services/air-quality.service';
import { ToastService } from '../../../services/toast.service';
import { Measurement, Zone, Sensor } from '../../../models/air-quality.models';
import { ModalComponent } from '../../../components/modal/modal.component';

@Component({
  selector: 'app-measurements',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <div class="measurements-page">
      <div class="page-header">
        <h2>Air Quality Measurements</h2>
        <div class="page-header-actions">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="filterMeasurements()" placeholder="Search by zone...">
          </div>
          <select class="filter-select" [(ngModel)]="zoneFilter" (ngModelChange)="filterMeasurements()">
            <option value="">All Zones</option>
            @for (zone of zones; track zone.id) {
              <option [value]="zone.name">{{ zone.name }}</option>
            }
          </select>
          <button class="btn btn-secondary" (click)="loadMeasurements()">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
          <button class="btn btn-primary" (click)="openCreateModal()">
            <i class="fas fa-plus"></i> Add Measurement
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          @if (loading) {
            <div class="loading-spinner">
              <div class="spinner"></div>
            </div>
          } @else if (filteredMeasurements.length === 0) {
            <div class="empty-state">
              <i class="fas fa-chart-line"></i>
              <h4>No measurements found</h4>
              <p>{{ searchTerm || zoneFilter ? 'No measurements match your criteria' : 'Start collecting air quality data' }}</p>
            </div>
          } @else {
            <table class="data-table">
              <thead>
                <tr>
                  <th>Zone</th>
                  <th>AQI</th>
                  <th>PM2.5</th>
                  <th>PM10</th>
                  <th>NO₂</th>
                  <th>CO₂</th>
                  <th>O₃</th>
                  <th>Temp</th>
                  <th>Humidity</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (m of filteredMeasurements; track m.id) {
                  <tr>
                    <td>
                      <div class="zone-cell">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>{{ m.zone }}</span>
                      </div>
                    </td>
                    <td>
                      <div class="aqi-badge" [ngClass]="getAqiClass(m.aqi)">
                        <span class="aqi-value">{{ m.aqi }}</span>
                        <span class="aqi-label">{{ getAqiLabel(m.aqi) }}</span>
                      </div>
                    </td>
                    <td>
                      <span class="metric-value">{{ m.pm25 || '-' }}</span>
                      <span class="metric-unit">µg/m³</span>
                    </td>
                    <td>
                      <span class="metric-value">{{ m.pm10 || '-' }}</span>
                      <span class="metric-unit">µg/m³</span>
                    </td>
                    <td>
                      <span class="metric-value">{{ m.no2 || '-' }}</span>
                      <span class="metric-unit">ppb</span>
                    </td>
                    <td>
                      <span class="metric-value">{{ m.co2 || '-' }}</span>
                      <span class="metric-unit">ppm</span>
                    </td>
                    <td>
                      <span class="metric-value">{{ m.o3 || '-' }}</span>
                      <span class="metric-unit">ppb</span>
                    </td>
                    <td>
                      <span class="temp-value">{{ m.temperature || '-' }}°C</span>
                    </td>
                    <td>
                      <span class="humidity-value">{{ m.humidity || '-' }}%</span>
                    </td>
                    <td>{{ formatDateTime(m.measurementTime) }}</td>
                    <td>
                      <div class="action-buttons">
                        <button class="btn-icon btn-view" (click)="viewMeasurement(m)" title="View Details">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon btn-delete" (click)="deleteMeasurement(m)" title="Delete">
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
        (saved)="saveMeasurement()">
        
        @if (modalMode === 'view') {
          <div class="detail-view">
            <div class="aqi-display" [ngClass]="getAqiClass(selectedMeasurement.aqi)">
              <span class="aqi-big">{{ selectedMeasurement.aqi }}</span>
              <span class="aqi-text">{{ getAqiLabel(selectedMeasurement.aqi) }}</span>
            </div>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">Zone</span>
                <span class="detail-value">{{ selectedMeasurement.zone }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Sensor ID</span>
                <span class="detail-value">{{ selectedMeasurement.sensorId }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">PM2.5</span>
                <span class="detail-value">{{ selectedMeasurement.pm25 || '-' }} µg/m³</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">PM10</span>
                <span class="detail-value">{{ selectedMeasurement.pm10 || '-' }} µg/m³</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">NO₂</span>
                <span class="detail-value">{{ selectedMeasurement.no2 || '-' }} ppb</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">CO₂</span>
                <span class="detail-value">{{ selectedMeasurement.co2 || '-' }} ppm</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">O₃</span>
                <span class="detail-value">{{ selectedMeasurement.o3 || '-' }} ppb</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Temperature</span>
                <span class="detail-value">{{ selectedMeasurement.temperature || '-' }}°C</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Humidity</span>
                <span class="detail-value">{{ selectedMeasurement.humidity || '-' }}%</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Battery</span>
                <span class="detail-value">{{ selectedMeasurement.batteryLevel || '-' }}%</span>
              </div>
              <div class="detail-item full">
                <span class="detail-label">Measurement Time</span>
                <span class="detail-value">{{ formatDateTime(selectedMeasurement.measurementTime) }}</span>
              </div>
            </div>
          </div>
        } @else {
          <div class="form-row">
            <div class="form-group">
              <label for="zone">Zone *</label>
              <select id="zone" [(ngModel)]="selectedMeasurement.zone" required>
                <option value="">Select zone...</option>
                @for (zone of zones; track zone.id) {
                  <option [value]="zone.name">{{ zone.name }}</option>
                }
              </select>
            </div>
            <div class="form-group">
              <label for="sensorId">Sensor *</label>
              <select id="sensorId" [(ngModel)]="selectedMeasurement.sensorId" required>
                <option value="">Select sensor...</option>
                @for (sensor of sensors; track sensor.id) {
                  <option [value]="sensor.id">{{ sensor.model }} ({{ sensor.zone }})</option>
                }
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="aqi">Air Quality Index (AQI) *</label>
            <input type="number" id="aqi" [(ngModel)]="selectedMeasurement.aqi" placeholder="0-500" min="0" max="500" required>
          </div>
          <div class="form-section">
            <h4>Pollutants</h4>
            <div class="form-row">
              <div class="form-group">
                <label for="pm25">PM2.5 (µg/m³)</label>
                <input type="number" id="pm25" [(ngModel)]="selectedMeasurement.pm25" placeholder="0.0" step="0.1">
              </div>
              <div class="form-group">
                <label for="pm10">PM10 (µg/m³)</label>
                <input type="number" id="pm10" [(ngModel)]="selectedMeasurement.pm10" placeholder="0.0" step="0.1">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="no2">NO₂ (ppb)</label>
                <input type="number" id="no2" [(ngModel)]="selectedMeasurement.no2" placeholder="0.0" step="0.1">
              </div>
              <div class="form-group">
                <label for="co2">CO₂ (ppm)</label>
                <input type="number" id="co2" [(ngModel)]="selectedMeasurement.co2" placeholder="0.0" step="0.1">
              </div>
            </div>
            <div class="form-group">
              <label for="o3">O₃ (ppb)</label>
              <input type="number" id="o3" [(ngModel)]="selectedMeasurement.o3" placeholder="0.0" step="0.1">
            </div>
          </div>
          <div class="form-section">
            <h4>Environmental</h4>
            <div class="form-row">
              <div class="form-group">
                <label for="temperature">Temperature (°C)</label>
                <input type="number" id="temperature" [(ngModel)]="selectedMeasurement.temperature" placeholder="0.0" step="0.1">
              </div>
              <div class="form-group">
                <label for="humidity">Humidity (%)</label>
                <input type="number" id="humidity" [(ngModel)]="selectedMeasurement.humidity" placeholder="0" min="0" max="100">
              </div>
            </div>
          </div>
        }
      </app-modal>
    </div>
  `,
  styles: [`
    .filter-select {
      padding: 10px 16px;
      border: 1px solid var(--gray-200);
      border-radius: 8px;
      font-size: 14px;
      background: white;
      cursor: pointer;
      min-width: 150px;
    }

    .zone-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }

    .zone-cell i {
      color: var(--primary);
    }

    .aqi-badge {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 16px;
      border-radius: 10px;
      min-width: 80px;
    }

    .aqi-badge.good { background: #dcfce7; color: #16a34a; }
    .aqi-badge.moderate { background: #fef3c7; color: #d97706; }
    .aqi-badge.unhealthy-sensitive { background: #fed7aa; color: #ea580c; }
    .aqi-badge.unhealthy { background: #fee2e2; color: #dc2626; }
    .aqi-badge.very-unhealthy { background: #f3e8ff; color: #9333ea; }
    .aqi-badge.hazardous { background: #fce7f3; color: #be185d; }

    .aqi-value {
      font-size: 20px;
      font-weight: 700;
    }

    .aqi-label {
      font-size: 9px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .metric-value {
      font-weight: 600;
      color: var(--gray-800);
    }

    .metric-unit {
      font-size: 11px;
      color: var(--gray-500);
      margin-left: 2px;
    }

    .temp-value {
      color: #ea580c;
      font-weight: 500;
    }

    .humidity-value {
      color: #2563eb;
      font-weight: 500;
    }

    .aqi-display {
      text-align: center;
      padding: 24px;
      border-radius: 16px;
      margin-bottom: 20px;
    }

    .aqi-display.good { background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); }
    .aqi-display.moderate { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); }
    .aqi-display.unhealthy-sensitive { background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%); }
    .aqi-display.unhealthy { background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); }
    .aqi-display.very-unhealthy { background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%); }
    .aqi-display.hazardous { background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%); }

    .aqi-big {
      font-size: 56px;
      font-weight: 800;
      display: block;
    }

    .aqi-text {
      font-size: 16px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .detail-item {
      background: var(--gray-50);
      padding: 12px 16px;
      border-radius: 8px;
    }

    .detail-item.full {
      grid-column: 1 / -1;
    }

    .detail-label {
      display: block;
      font-size: 11px;
      color: var(--gray-500);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }

    .detail-value {
      font-size: 16px;
      font-weight: 600;
      color: var(--gray-800);
    }

    .form-section {
      margin-top: 20px;
      padding-top: 20px;
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
export class MeasurementsComponent implements OnInit {
  measurements: Measurement[] = [];
  filteredMeasurements: Measurement[] = [];
  zones: Zone[] = [];
  sensors: Sensor[] = [];
  searchTerm = '';
  zoneFilter = '';
  loading = true;
  modalOpen = false;
  modalMode: 'create' | 'view' = 'create';
  modalTitle = 'New Measurement';
  selectedMeasurement: Measurement = this.getEmptyMeasurement();

  constructor(
    private airQualityService: AirQualityService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadMeasurements();
    this.loadZones();
    this.loadSensors();
  }

  loadMeasurements(): void {
    this.loading = true;
    this.airQualityService.getMeasurements().subscribe({
      next: (data) => {
        this.measurements = data;
        this.filterMeasurements();
        this.loading = false;
      },
      error: () => {
        this.toastService.error('Failed to load measurements');
        this.loading = false;
      }
    });
  }

  loadZones(): void {
    this.airQualityService.getZones().subscribe({
      next: (data) => this.zones = data
    });
  }

  loadSensors(): void {
    this.airQualityService.getSensors().subscribe({
      next: (data) => this.sensors = data
    });
  }

  filterMeasurements(): void {
    let filtered = [...this.measurements];
    
    if (this.zoneFilter) {
      filtered = filtered.filter(m => m.zone === this.zoneFilter);
    }
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(m => m.zone?.toLowerCase().includes(term));
    }
    
    this.filteredMeasurements = filtered;
  }

  getEmptyMeasurement(): Measurement {
    return { sensorId: '', zone: '', aqi: 0 };
  }

  openCreateModal(): void {
    this.selectedMeasurement = this.getEmptyMeasurement();
    this.modalMode = 'create';
    this.modalTitle = 'Add Measurement';
    this.modalOpen = true;
  }

  viewMeasurement(m: Measurement): void {
    this.selectedMeasurement = { ...m };
    this.modalMode = 'view';
    this.modalTitle = 'Measurement Details';
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selectedMeasurement = this.getEmptyMeasurement();
  }

  saveMeasurement(): void {
    this.airQualityService.createMeasurement(this.selectedMeasurement).subscribe({
      next: () => {
        this.toastService.success('Measurement recorded successfully');
        this.loadMeasurements();
        this.closeModal();
      },
      error: () => this.toastService.error('Failed to record measurement')
    });
  }

  deleteMeasurement(m: Measurement): void {
    if (confirm('Are you sure you want to delete this measurement?')) {
      this.airQualityService.deleteMeasurement(m.id!).subscribe({
        next: () => {
          this.toastService.success('Measurement deleted successfully');
          this.loadMeasurements();
        },
        error: () => this.toastService.error('Failed to delete measurement')
      });
    }
  }

  getAqiClass(aqi: number): string {
    if (aqi <= 50) return 'good';
    if (aqi <= 100) return 'moderate';
    if (aqi <= 150) return 'unhealthy-sensitive';
    if (aqi <= 200) return 'unhealthy';
    if (aqi <= 300) return 'very-unhealthy';
    return 'hazardous';
  }

  getAqiLabel(aqi: number): string {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy (Sens.)';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  }

  formatDateTime(date?: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleString();
  }
}
