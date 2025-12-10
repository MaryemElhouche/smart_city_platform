import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmergencyService } from '../../../services/emergency.service';
import { ToastService } from '../../../services/toast.service';
import { EmergencyUnit, Location } from '../../../models/emergency.models';
import { ModalComponent } from '../../../components/modal/modal.component';

@Component({
  selector: 'app-units',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <div class="units-page">
      <div class="page-header">
        <h2>Emergency Units</h2>
        <div class="page-header-actions">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="filterUnits()" placeholder="Search units...">
          </div>
          <button class="btn btn-secondary" (click)="loadUnits()">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
          <button class="btn btn-primary" (click)="openCreateModal()">
            <i class="fas fa-plus"></i> Add Unit
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          @if (loading) {
            <div class="loading-spinner">
              <div class="spinner"></div>
            </div>
          } @else if (filteredUnits.length === 0) {
            <div class="empty-state">
              <i class="fas fa-users"></i>
              <h4>No units found</h4>
              <p>{{ searchTerm ? 'No units match your search' : 'Add an emergency unit to get started' }}</p>
            </div>
          } @else {
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Resources</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (unit of filteredUnits; track unit.id) {
                  <tr>
                    <td>{{ unit.id }}</td>
                    <td>
                      <div class="unit-name-cell">
                        <i class="fas" [ngClass]="getUnitIcon(unit.type)"></i>
                        {{ unit.name }}
                      </div>
                    </td>
                    <td>
                      <span class="type-badge">{{ unit.type }}</span>
                    </td>
                    <td>
                      <span class="status-badge" [ngClass]="getStatusClass(unit.status)">
                        {{ unit.status || 'Unknown' }}
                      </span>
                    </td>
                    <td>{{ unit.location?.address || formatLocation(unit.location) }}</td>
                    <td>{{ unit.resourceIds?.length || 0 }} resources</td>
                    <td>
                      <div class="action-buttons">
                        <button class="btn-icon btn-view" (click)="viewUnit(unit)" title="View">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon btn-edit" (click)="openStatusModal(unit)" title="Update Status">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-delete" (click)="deleteUnit(unit)" title="Delete">
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
        (saved)="saveUnit()">
        
        @if (modalMode === 'view') {
          <div class="detail-view">
            <div class="detail-row"><strong>ID:</strong> {{ selectedUnit.id }}</div>
            <div class="detail-row"><strong>Name:</strong> {{ selectedUnit.name }}</div>
            <div class="detail-row"><strong>Type:</strong> <span class="type-badge">{{ selectedUnit.type }}</span></div>
            <div class="detail-row"><strong>Status:</strong> 
              <span class="status-badge" [ngClass]="getStatusClass(selectedUnit.status)">
                {{ selectedUnit.status }}
              </span>
            </div>
            <div class="detail-row"><strong>Location:</strong> {{ selectedUnit.location?.address || formatLocation(selectedUnit.location) }}</div>
            <div class="detail-row"><strong>Resources:</strong> {{ selectedUnit.resourceIds?.length || 0 }}</div>
            <div class="detail-row"><strong>Incident Logs:</strong> {{ selectedUnit.incidentLogIds?.length || 0 }}</div>
          </div>
        } @else if (modalMode === 'status') {
          <div class="form-group">
            <label for="newStatus">New Status</label>
            <select id="newStatus" [(ngModel)]="newStatus" required>
              <option value="AVAILABLE">Available</option>
              <option value="BUSY">Busy</option>
              <option value="ON_MISSION">On Mission</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
            </select>
          </div>
        } @else {
          <div class="form-group">
            <label for="name">Name *</label>
            <input type="text" id="name" [(ngModel)]="selectedUnit.name" placeholder="Enter unit name" required>
          </div>
          <div class="form-group">
            <label for="type">Type *</label>
            <select id="type" [(ngModel)]="selectedUnit.type" required>
              <option value="AMBULANCE">Ambulance</option>
              <option value="FIRE">Fire Brigade</option>
              <option value="POLICE">Police</option>
              <option value="RESCUE">Rescue Team</option>
              <option value="MEDICAL">Medical Team</option>
            </select>
          </div>
          <div class="form-group">
            <label for="status">Status *</label>
            <select id="status" [(ngModel)]="selectedUnit.status" required>
              <option value="AVAILABLE">Available</option>
              <option value="BUSY">Busy</option>
              <option value="ON_MISSION">On Mission</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
            </select>
          </div>
          <div class="form-section">
            <h4>Current Location</h4>
            <div class="form-group">
              <label for="address">Address</label>
              <input type="text" id="address" [(ngModel)]="selectedUnit.location!.address" placeholder="Enter address">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="latitude">Latitude</label>
                <input type="number" id="latitude" [(ngModel)]="selectedUnit.location!.latitude" placeholder="0.0" step="0.000001">
              </div>
              <div class="form-group">
                <label for="longitude">Longitude</label>
                <input type="number" id="longitude" [(ngModel)]="selectedUnit.location!.longitude" placeholder="0.0" step="0.000001">
              </div>
            </div>
          </div>
        }
      </app-modal>
    </div>
  `,
  styles: [`
    .unit-name-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .unit-name-cell i {
      width: 28px;
      height: 28px;
      background: var(--gray-100);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--gray-600);
      font-size: 12px;
    }

    .type-badge {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      background: #E0E7FF;
      color: #4F46E5;
    }

    .status-badge {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
    }

    .status-badge.available {
      background: #DCFCE7;
      color: #16A34A;
    }

    .status-badge.busy, .status-badge.on_mission {
      background: #FEF3C7;
      color: #D97706;
    }

    .status-badge.out_of_service {
      background: #FEE2E2;
      color: #DC2626;
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
export class UnitsComponent implements OnInit {
  units: EmergencyUnit[] = [];
  filteredUnits: EmergencyUnit[] = [];
  searchTerm = '';
  loading = true;
  modalOpen = false;
  modalMode: 'create' | 'view' | 'status' = 'create';
  modalTitle = 'Add Emergency Unit';
  selectedUnit: EmergencyUnit = this.getEmptyUnit();
  newStatus = 'AVAILABLE';

  constructor(
    private emergencyService: EmergencyService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadUnits();
  }

  loadUnits(): void {
    this.loading = true;
    this.emergencyService.getUnits().subscribe({
      next: (data) => {
        this.units = data;
        this.filterUnits();
        this.loading = false;
      },
      error: () => {
        this.toastService.error('Failed to load units');
        this.loading = false;
      }
    });
  }

  filterUnits(): void {
    if (!this.searchTerm) {
      this.filteredUnits = [...this.units];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredUnits = this.units.filter(u =>
        u.name?.toLowerCase().includes(term) ||
        u.type?.toLowerCase().includes(term) ||
        u.status?.toLowerCase().includes(term) ||
        u.location?.address?.toLowerCase().includes(term)
      );
    }
  }

  getEmptyUnit(): EmergencyUnit {
    return {
      name: '',
      type: 'AMBULANCE',
      status: 'AVAILABLE',
      location: { latitude: 0, longitude: 0, address: '' }
    };
  }

  openCreateModal(): void {
    this.selectedUnit = this.getEmptyUnit();
    this.modalMode = 'create';
    this.modalTitle = 'Add Emergency Unit';
    this.modalOpen = true;
  }

  viewUnit(unit: EmergencyUnit): void {
    this.selectedUnit = { ...unit };
    this.modalMode = 'view';
    this.modalTitle = 'Unit Details';
    this.modalOpen = true;
  }

  openStatusModal(unit: EmergencyUnit): void {
    this.selectedUnit = { ...unit };
    this.newStatus = unit.status;
    this.modalMode = 'status';
    this.modalTitle = 'Update Unit Status';
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selectedUnit = this.getEmptyUnit();
  }

  saveUnit(): void {
    if (this.modalMode === 'status') {
      this.emergencyService.updateUnitStatus(this.selectedUnit.id!, this.newStatus).subscribe({
        next: () => {
          this.toastService.success('Status updated successfully');
          this.loadUnits();
          this.closeModal();
        },
        error: () => {
          this.toastService.error('Failed to update status');
        }
      });
    } else {
      this.emergencyService.createUnit(this.selectedUnit).subscribe({
        next: () => {
          this.toastService.success('Unit created successfully');
          this.loadUnits();
          this.closeModal();
        },
        error: () => {
          this.toastService.error('Failed to create unit');
        }
      });
    }
  }

  deleteUnit(unit: EmergencyUnit): void {
    if (confirm(`Are you sure you want to delete "${unit.name}"?`)) {
      this.emergencyService.deleteUnit(unit.id!).subscribe({
        next: () => {
          this.toastService.success('Unit deleted successfully');
          this.loadUnits();
        },
        error: () => {
          this.toastService.error('Failed to delete unit');
        }
      });
    }
  }

  getStatusClass(status: string): string {
    return status?.toLowerCase().replace(' ', '_') || 'available';
  }

  getUnitIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'AMBULANCE': 'fa-ambulance',
      'FIRE': 'fa-fire-extinguisher',
      'POLICE': 'fa-shield-alt',
      'RESCUE': 'fa-life-ring',
      'MEDICAL': 'fa-user-md'
    };
    return icons[type?.toUpperCase()] || 'fa-truck';
  }

  formatLocation(location?: Location): string {
    if (!location) return '-';
    if (location.latitude && location.longitude) {
      return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
    }
    return '-';
  }
}
