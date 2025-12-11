import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AirQualityService } from '../../../services/air-quality.service';
import { ToastService } from '../../../services/toast.service';
import { Zone } from '../../../models/air-quality.models';
import { ModalComponent } from '../../../components/modal/modal.component';

@Component({
  selector: 'app-zones',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <div class="zones-page">
      <div class="page-header">
        <h2>Monitoring Zones</h2>
        <div class="page-header-actions">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="filterZones()" placeholder="Search zones...">
          </div>
          <button class="btn btn-secondary" (click)="loadZones()">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
          <button class="btn btn-primary" (click)="openCreateModal()">
            <i class="fas fa-plus"></i> New Zone
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          @if (loading) {
            <div class="loading-spinner">
              <div class="spinner"></div>
            </div>
          } @else if (filteredZones.length === 0) {
            <div class="empty-state">
              <i class="fas fa-map-marked-alt"></i>
              <h4>No zones found</h4>
              <p>{{ searchTerm ? 'No zones match your search' : 'Create your first monitoring zone to get started' }}</p>
            </div>
          } @else {
            <div class="zones-grid">
              @for (zone of filteredZones; track zone.id) {
                <div class="zone-card">
                  <div class="zone-header">
                    <div class="zone-icon" [ngClass]="getZoneTypeClass(zone.type)">
                      <i [class]="getZoneIcon(zone.type)"></i>
                    </div>
                    <div class="zone-actions">
                      <button class="btn-icon" (click)="viewZone(zone)" title="View">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn-icon" (click)="editZone(zone)" title="Edit">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn-icon btn-delete" (click)="deleteZone(zone)" title="Delete">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  <div class="zone-body">
                    <h3>{{ zone.name }}</h3>
                    <span class="zone-type-badge" [ngClass]="getZoneTypeClass(zone.type)">{{ zone.type }}</span>
                  </div>
                  <div class="zone-details">
                    <div class="detail-item">
                      <i class="fas fa-users"></i>
                      <span>{{ zone.population?.toLocaleString() || '-' }} pop.</span>
                    </div>
                    <div class="detail-item">
                      <i class="fas fa-ruler-combined"></i>
                      <span>{{ zone.areaKm2 || '-' }} km²</span>
                    </div>
                    <div class="detail-item">
                      <i class="fas fa-map-marker-alt"></i>
                      <span>{{ zone.adminRegion || '-' }}</span>
                    </div>
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
        (saved)="saveZone()">
        
        @if (modalMode === 'view') {
          <div class="detail-view">
            <div class="detail-row"><strong>ID:</strong> {{ selectedZone.id }}</div>
            <div class="detail-row"><strong>Name:</strong> {{ selectedZone.name }}</div>
            <div class="detail-row"><strong>Type:</strong> 
              <span class="zone-type-badge" [ngClass]="getZoneTypeClass(selectedZone.type)">{{ selectedZone.type }}</span>
            </div>
            <div class="detail-row"><strong>Population:</strong> {{ selectedZone.population?.toLocaleString() || '-' }}</div>
            <div class="detail-row"><strong>Area:</strong> {{ selectedZone.areaKm2 || '-' }} km²</div>
            <div class="detail-row"><strong>Admin Region:</strong> {{ selectedZone.adminRegion || '-' }}</div>
          </div>
        } @else {
          <div class="form-group">
            <label for="name">Zone Name *</label>
            <input type="text" id="name" [(ngModel)]="selectedZone.name" placeholder="Enter zone name" required>
          </div>
          <div class="form-group">
            <label for="type">Zone Type *</label>
            <select id="type" [(ngModel)]="selectedZone.type" required>
              <option value="">Select type...</option>
              <option value="URBAN">Urban</option>
              <option value="SUBURBAN">Suburban</option>
              <option value="INDUSTRIAL">Industrial</option>
              <option value="RESIDENTIAL">Residential</option>
              <option value="COMMERCIAL">Commercial</option>
              <option value="RURAL">Rural</option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="population">Population</label>
              <input type="number" id="population" [(ngModel)]="selectedZone.population" placeholder="0">
            </div>
            <div class="form-group">
              <label for="areaKm2">Area (km²)</label>
              <input type="number" id="areaKm2" [(ngModel)]="selectedZone.areaKm2" placeholder="0.0" step="0.01">
            </div>
          </div>
          <div class="form-group">
            <label for="adminRegion">Administrative Region</label>
            <input type="text" id="adminRegion" [(ngModel)]="selectedZone.adminRegion" placeholder="Enter region">
          </div>
        }
      </app-modal>
    </div>
  `,
  styles: [`
    .zones-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    .zone-card {
      background: white;
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      border: 1px solid var(--gray-100);
      transition: all 200ms ease;
    }

    .zone-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }

    .zone-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .zone-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: white;
    }

    .zone-icon.urban { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .zone-icon.suburban { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
    .zone-icon.industrial { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .zone-icon.residential { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
    .zone-icon.commercial { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
    .zone-icon.rural { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }

    .zone-actions {
      display: flex;
      gap: 4px;
    }

    .zone-body {
      margin-bottom: 16px;
    }

    .zone-body h3 {
      font-size: 18px;
      font-weight: 600;
      color: var(--gray-900);
      margin-bottom: 8px;
    }

    .zone-type-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .zone-type-badge.urban { background: #ede9fe; color: #7c3aed; }
    .zone-type-badge.suburban { background: #d1fae5; color: #059669; }
    .zone-type-badge.industrial { background: #fce7f3; color: #db2777; }
    .zone-type-badge.residential { background: #dbeafe; color: #2563eb; }
    .zone-type-badge.commercial { background: #fef3c7; color: #d97706; }
    .zone-type-badge.rural { background: #d1fae5; color: #10b981; }

    .zone-details {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--gray-100);
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: var(--gray-600);
    }

    .detail-item i {
      color: var(--gray-400);
      font-size: 12px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .btn-icon {
      width: 32px;
      height: 32px;
      border: none;
      background: var(--gray-100);
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--gray-600);
      transition: all 150ms ease;
    }

    .btn-icon:hover {
      background: var(--gray-200);
      color: var(--gray-800);
    }

    .btn-icon.btn-delete:hover {
      background: #fee2e2;
      color: #dc2626;
    }
  `]
})
export class ZonesComponent implements OnInit {
  zones: Zone[] = [];
  filteredZones: Zone[] = [];
  searchTerm = '';
  loading = true;
  modalOpen = false;
  modalMode: 'create' | 'edit' | 'view' = 'create';
  modalTitle = 'New Zone';
  selectedZone: Zone = this.getEmptyZone();

  constructor(
    private airQualityService: AirQualityService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadZones();
  }

  loadZones(): void {
    this.loading = true;
    this.airQualityService.getZones().subscribe({
      next: (data) => {
        this.zones = data;
        this.filterZones();
        this.loading = false;
      },
      error: () => {
        this.toastService.error('Failed to load zones');
        this.loading = false;
      }
    });
  }

  filterZones(): void {
    if (!this.searchTerm) {
      this.filteredZones = [...this.zones];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredZones = this.zones.filter(z =>
        z.name?.toLowerCase().includes(term) ||
        z.type?.toLowerCase().includes(term) ||
        z.adminRegion?.toLowerCase().includes(term)
      );
    }
  }

  getEmptyZone(): Zone {
    return { name: '', type: '' };
  }

  openCreateModal(): void {
    this.selectedZone = this.getEmptyZone();
    this.modalMode = 'create';
    this.modalTitle = 'New Zone';
    this.modalOpen = true;
  }

  viewZone(zone: Zone): void {
    this.selectedZone = { ...zone };
    this.modalMode = 'view';
    this.modalTitle = 'Zone Details';
    this.modalOpen = true;
  }

  editZone(zone: Zone): void {
    this.selectedZone = { ...zone };
    this.modalMode = 'edit';
    this.modalTitle = 'Edit Zone';
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selectedZone = this.getEmptyZone();
  }

  saveZone(): void {
    if (this.modalMode === 'edit' && this.selectedZone.id) {
      this.airQualityService.updateZone(this.selectedZone.id, this.selectedZone).subscribe({
        next: () => {
          this.toastService.success('Zone updated successfully');
          this.loadZones();
          this.closeModal();
        },
        error: () => this.toastService.error('Failed to update zone')
      });
    } else {
      this.airQualityService.createZone(this.selectedZone).subscribe({
        next: () => {
          this.toastService.success('Zone created successfully');
          this.loadZones();
          this.closeModal();
        },
        error: () => this.toastService.error('Failed to create zone')
      });
    }
  }

  deleteZone(zone: Zone): void {
    if (confirm(`Are you sure you want to delete zone "${zone.name}"?`)) {
      this.airQualityService.deleteZone(zone.id!).subscribe({
        next: () => {
          this.toastService.success('Zone deleted successfully');
          this.loadZones();
        },
        error: () => this.toastService.error('Failed to delete zone')
      });
    }
  }

  getZoneTypeClass(type: string): string {
    return type?.toLowerCase() || '';
  }

  getZoneIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'URBAN': 'fas fa-city',
      'SUBURBAN': 'fas fa-home',
      'INDUSTRIAL': 'fas fa-industry',
      'RESIDENTIAL': 'fas fa-building',
      'COMMERCIAL': 'fas fa-store',
      'RURAL': 'fas fa-tree'
    };
    return icons[type?.toUpperCase()] || 'fas fa-map';
  }
}
