import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmergencyService } from '../../../services/emergency.service';
import { ToastService } from '../../../services/toast.service';
import { Resource, EmergencyUnit, EmergencyEvent } from '../../../models/emergency.models';
import { ModalComponent } from '../../../components/modal/modal.component';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <div class="resources-page">
      <div class="page-header">
        <h2>Resources</h2>
        <div class="page-header-actions">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="filterResources()" placeholder="Search resources...">
          </div>
          <button class="btn btn-secondary" (click)="loadResources()">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
          <button class="btn btn-primary" (click)="openCreateModal()">
            <i class="fas fa-plus"></i> Add Resource
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          @if (loading) {
            <div class="loading-spinner">
              <div class="spinner"></div>
            </div>
          } @else if (filteredResources.length === 0) {
            <div class="empty-state">
              <i class="fas fa-tools"></i>
              <h4>No resources found</h4>
              <p>{{ searchTerm ? 'No resources match your search' : 'Add a resource to get started' }}</p>
            </div>
          } @else {
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Assigned Unit</th>
                  <th>Assigned Event</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (resource of filteredResources; track resource.id) {
                  <tr>
                    <td>{{ resource.id }}</td>
                    <td>
                      <div class="resource-name-cell">
                        <i class="fas" [ngClass]="getResourceIcon(resource.type)"></i>
                        {{ resource.name }}
                      </div>
                    </td>
                    <td>
                      <span class="type-badge" [ngClass]="getTypeClass(resource.type)">{{ resource.type }}</span>
                    </td>
                    <td>
                      <span class="status-badge" [ngClass]="getStatusClass(resource.status)">
                        {{ resource.status || 'Unknown' }}
                      </span>
                    </td>
                    <td>{{ getUnitName(resource.assignedUnitId) }}</td>
                    <td>{{ getEventDescription(resource.assignedEventId) }}</td>
                    <td>
                      <div class="action-buttons">
                        <button class="btn-icon btn-view" (click)="viewResource(resource)" title="View">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon btn-edit" (click)="openStatusModal(resource)" title="Update Status">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-delete" (click)="deleteResource(resource)" title="Delete">
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
        (saved)="saveResource()">
        
        @if (modalMode === 'view') {
          <div class="detail-view">
            <div class="detail-row"><strong>ID:</strong> {{ selectedResource.id }}</div>
            <div class="detail-row"><strong>Name:</strong> {{ selectedResource.name }}</div>
            <div class="detail-row"><strong>Type:</strong> <span class="type-badge" [ngClass]="getTypeClass(selectedResource.type)">{{ selectedResource.type }}</span></div>
            <div class="detail-row"><strong>Status:</strong> 
              <span class="status-badge" [ngClass]="getStatusClass(selectedResource.status)">
                {{ selectedResource.status }}
              </span>
            </div>
            <div class="detail-row"><strong>Assigned Unit:</strong> {{ getUnitName(selectedResource.assignedUnitId) }}</div>
            <div class="detail-row"><strong>Assigned Event:</strong> {{ getEventDescription(selectedResource.assignedEventId) }}</div>
          </div>
        } @else if (modalMode === 'status') {
          <div class="form-group">
            <label for="newStatus">New Status</label>
            <select id="newStatus" [(ngModel)]="newStatus" required>
              <option value="AVAILABLE">Available</option>
              <option value="IN_USE">In Use</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
            </select>
          </div>
        } @else {
          <div class="form-group">
            <label for="name">Name *</label>
            <input type="text" id="name" [(ngModel)]="selectedResource.name" placeholder="Enter resource name" required>
          </div>
          <div class="form-group">
            <label for="type">Type *</label>
            <select id="type" [(ngModel)]="selectedResource.type" required>
              <option value="VEHICLE">Vehicle</option>
              <option value="EQUIPMENT">Equipment</option>
              <option value="MEDICAL">Medical Supply</option>
              <option value="COMMUNICATION">Communication</option>
              <option value="TOOLS">Tools</option>
            </select>
          </div>
          <div class="form-group">
            <label for="status">Status *</label>
            <select id="status" [(ngModel)]="selectedResource.status" required>
              <option value="AVAILABLE">Available</option>
              <option value="IN_USE">In Use</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
            </select>
          </div>
          <div class="form-group">
            <label for="unitId">Assign to Unit</label>
            <select id="unitId" [(ngModel)]="selectedResource.assignedUnitId">
              <option [ngValue]="null">Not assigned</option>
              @for (unit of units; track unit.id) {
                <option [ngValue]="unit.id">{{ unit.name }} ({{ unit.type }})</option>
              }
            </select>
          </div>
          <div class="form-group">
            <label for="eventId">Assign to Event</label>
            <select id="eventId" [(ngModel)]="selectedResource.assignedEventId">
              <option [ngValue]="null">Not assigned</option>
              @for (event of events; track event.id) {
                <option [ngValue]="event.id">#{{ event.id }} - {{ event.description | slice:0:40 }}{{ event.description && event.description.length > 40 ? '...' : '' }}</option>
              }
            </select>
          </div>
        }
      </app-modal>
    </div>
  `,
  styles: [`
    .resource-name-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .resource-name-cell i {
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
    }

    .type-badge.vehicle {
      background: #E0F2FE;
      color: #0284C7;
    }

    .type-badge.equipment {
      background: #FEF3C7;
      color: #D97706;
    }

    .type-badge.medical {
      background: #FEE2E2;
      color: #DC2626;
    }

    .type-badge.communication {
      background: #E0E7FF;
      color: #4F46E5;
    }

    .type-badge.tools {
      background: #F3F4F6;
      color: #4B5563;
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

    .status-badge.in_use {
      background: #FEF3C7;
      color: #D97706;
    }

    .status-badge.maintenance {
      background: #E0E7FF;
      color: #4F46E5;
    }

    .status-badge.out_of_service {
      background: #FEE2E2;
      color: #DC2626;
    }
  `]
})
export class ResourcesComponent implements OnInit {
  resources: Resource[] = [];
  filteredResources: Resource[] = [];
  units: EmergencyUnit[] = [];
  events: EmergencyEvent[] = [];
  searchTerm = '';
  loading = true;
  modalOpen = false;
  modalMode: 'create' | 'view' | 'status' = 'create';
  modalTitle = 'Add Resource';
  selectedResource: Resource = this.getEmptyResource();
  newStatus = 'AVAILABLE';

  constructor(
    private emergencyService: EmergencyService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadResources();
    this.loadUnits();
    this.loadEvents();
  }

  loadResources(): void {
    this.loading = true;
    this.emergencyService.getResources().subscribe({
      next: (data) => {
        this.resources = data;
        this.filterResources();
        this.loading = false;
      },
      error: () => {
        this.toastService.error('Failed to load resources');
        this.loading = false;
      }
    });
  }

  loadUnits(): void {
    this.emergencyService.getUnits().subscribe({
      next: (data) => this.units = data
    });
  }

  loadEvents(): void {
    this.emergencyService.getEvents().subscribe({
      next: (data) => this.events = data
    });
  }

  filterResources(): void {
    if (!this.searchTerm) {
      this.filteredResources = [...this.resources];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredResources = this.resources.filter(r =>
        r.name?.toLowerCase().includes(term) ||
        r.type?.toLowerCase().includes(term) ||
        r.status?.toLowerCase().includes(term)
      );
    }
  }

  getEmptyResource(): Resource {
    return {
      name: '',
      type: 'EQUIPMENT',
      status: 'AVAILABLE'
    };
  }

  openCreateModal(): void {
    this.selectedResource = this.getEmptyResource();
    this.modalMode = 'create';
    this.modalTitle = 'Add Resource';
    this.modalOpen = true;
  }

  viewResource(resource: Resource): void {
    this.selectedResource = { ...resource };
    this.modalMode = 'view';
    this.modalTitle = 'Resource Details';
    this.modalOpen = true;
  }

  openStatusModal(resource: Resource): void {
    this.selectedResource = { ...resource };
    this.newStatus = resource.status;
    this.modalMode = 'status';
    this.modalTitle = 'Update Resource Status';
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selectedResource = this.getEmptyResource();
  }

  saveResource(): void {
    if (this.modalMode === 'status') {
      this.emergencyService.updateResourceStatus(this.selectedResource.id!, this.newStatus).subscribe({
        next: () => {
          this.toastService.success('Status updated successfully');
          this.loadResources();
          this.closeModal();
        },
        error: () => {
          this.toastService.error('Failed to update status');
        }
      });
    } else {
      this.emergencyService.createResource(this.selectedResource).subscribe({
        next: () => {
          this.toastService.success('Resource created successfully');
          this.loadResources();
          this.closeModal();
        },
        error: () => {
          this.toastService.error('Failed to create resource');
        }
      });
    }
  }

  deleteResource(resource: Resource): void {
    if (confirm(`Are you sure you want to delete "${resource.name}"?`)) {
      this.emergencyService.deleteResource(resource.id!).subscribe({
        next: () => {
          this.toastService.success('Resource deleted successfully');
          this.loadResources();
        },
        error: () => {
          this.toastService.error('Failed to delete resource');
        }
      });
    }
  }

  getStatusClass(status: string): string {
    return status?.toLowerCase().replace(' ', '_') || 'available';
  }

  getTypeClass(type: string): string {
    return type?.toLowerCase() || 'equipment';
  }

  getResourceIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'VEHICLE': 'fa-truck',
      'EQUIPMENT': 'fa-toolbox',
      'MEDICAL': 'fa-medkit',
      'COMMUNICATION': 'fa-walkie-talkie',
      'TOOLS': 'fa-wrench'
    };
    return icons[type?.toUpperCase()] || 'fa-box';
  }

  getUnitName(unitId?: number): string {
    if (!unitId) return 'Not assigned';
    const unit = this.units.find(u => u.id === unitId);
    return unit ? unit.name : `Unit #${unitId}`;
  }

  getEventDescription(eventId?: number): string {
    if (!eventId) return 'Not assigned';
    const event = this.events.find(e => e.id === eventId);
    return event ? `#${eventId}` : `Event #${eventId}`;
  }
}
