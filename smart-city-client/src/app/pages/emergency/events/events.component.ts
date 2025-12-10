import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmergencyService } from '../../../services/emergency.service';
import { ToastService } from '../../../services/toast.service';
import { EmergencyEvent, EmergencyUnit, Location } from '../../../models/emergency.models';
import { ModalComponent } from '../../../components/modal/modal.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <div class="events-page">
      <div class="page-header">
        <h2>Emergency Events</h2>
        <div class="page-header-actions">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="filterEvents()" placeholder="Search events...">
          </div>
          <button class="btn btn-secondary" (click)="loadEvents()">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
          <button class="btn btn-primary" (click)="openCreateModal()">
            <i class="fas fa-plus"></i> New Event
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          @if (loading) {
            <div class="loading-spinner">
              <div class="spinner"></div>
            </div>
          } @else if (filteredEvents.length === 0) {
            <div class="empty-state">
              <i class="fas fa-exclamation-circle"></i>
              <h4>No events found</h4>
              <p>{{ searchTerm ? 'No events match your search' : 'Report a new emergency event to get started' }}</p>
            </div>
          } @else {
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Description</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Assigned Unit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (event of filteredEvents; track event.id) {
                  <tr>
                    <td>{{ event.id }}</td>
                    <td>{{ event.description || '-' }}</td>
                    <td>
                      <span class="severity-badge" [ngClass]="getSeverityClass(event.severity)">
                        {{ event.severity || 'Unknown' }}
                      </span>
                    </td>
                    <td>
                      <span class="status-badge" [ngClass]="getStatusClass(event.status)">
                        {{ event.status || 'Unknown' }}
                      </span>
                    </td>
                    <td>{{ event.location?.address || formatLocation(event.location) }}</td>
                    <td>{{ getUnitName(event.assignedUnitId) }}</td>
                    <td>
                      <div class="action-buttons">
                        <button class="btn-icon btn-view" (click)="viewEvent(event)" title="View">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon btn-edit" (click)="openAssignModal(event)" title="Assign Unit">
                          <i class="fas fa-user-plus"></i>
                        </button>
                        <button class="btn-icon btn-delete" (click)="deleteEvent(event)" title="Delete">
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

      <!-- Create/View Modal -->
      <app-modal 
        [isOpen]="modalOpen" 
        [title]="modalTitle" 
        [viewOnly]="modalMode === 'view'"
        (closed)="closeModal()" 
        (saved)="saveEvent()">
        
        @if (modalMode === 'view') {
          <div class="detail-view">
            <div class="detail-row"><strong>ID:</strong> {{ selectedEvent.id }}</div>
            <div class="detail-row"><strong>Description:</strong> {{ selectedEvent.description || '-' }}</div>
            <div class="detail-row"><strong>Severity:</strong> 
              <span class="severity-badge" [ngClass]="getSeverityClass(selectedEvent.severity)">
                {{ selectedEvent.severity || '-' }}
              </span>
            </div>
            <div class="detail-row"><strong>Status:</strong> 
              <span class="status-badge" [ngClass]="getStatusClass(selectedEvent.status)">
                {{ selectedEvent.status || '-' }}
              </span>
            </div>
            <div class="detail-row"><strong>Location:</strong> {{ selectedEvent.location?.address || formatLocation(selectedEvent.location) }}</div>
            <div class="detail-row"><strong>Assigned Unit:</strong> {{ getUnitName(selectedEvent.assignedUnitId) }}</div>
          </div>
        } @else if (modalMode === 'assign') {
          <div class="form-group">
            <label for="unitId">Select Unit to Assign</label>
            <select id="unitId" [(ngModel)]="selectedUnitId" required>
              <option [ngValue]="null">Select a unit...</option>
              @for (unit of availableUnits; track unit.id) {
                <option [ngValue]="unit.id">{{ unit.name }} ({{ unit.type }}) - {{ unit.status }}</option>
              }
            </select>
          </div>
        } @else {
          <div class="form-group">
            <label for="description">Description *</label>
            <textarea id="description" [(ngModel)]="selectedEvent.description" placeholder="Describe the emergency" rows="3" required></textarea>
          </div>
          <div class="form-group">
            <label for="severity">Severity *</label>
            <select id="severity" [(ngModel)]="selectedEvent.severity" required>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
          <div class="form-group">
            <label for="status">Status *</label>
            <select id="status" [(ngModel)]="selectedEvent.status" required>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          <div class="form-section">
            <h4>Location</h4>
            <div class="form-group">
              <label for="address">Address</label>
              <input type="text" id="address" [(ngModel)]="selectedEvent.location!.address" placeholder="Enter address">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="latitude">Latitude</label>
                <input type="number" id="latitude" [(ngModel)]="selectedEvent.location!.latitude" placeholder="0.0" step="0.000001">
              </div>
              <div class="form-group">
                <label for="longitude">Longitude</label>
                <input type="number" id="longitude" [(ngModel)]="selectedEvent.location!.longitude" placeholder="0.0" step="0.000001">
              </div>
            </div>
          </div>
        }
      </app-modal>
    </div>
  `,
  styles: [`
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
    }

    .status-badge.open {
      background: #FEE2E2;
      color: #DC2626;
    }

    .status-badge.in_progress {
      background: #FEF3C7;
      color: #D97706;
    }

    .status-badge.resolved, .status-badge.closed {
      background: #DCFCE7;
      color: #16A34A;
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

    textarea {
      resize: vertical;
      min-height: 80px;
    }
  `]
})
export class EventsComponent implements OnInit {
  events: EmergencyEvent[] = [];
  filteredEvents: EmergencyEvent[] = [];
  units: EmergencyUnit[] = [];
  availableUnits: EmergencyUnit[] = [];
  searchTerm = '';
  loading = true;
  modalOpen = false;
  modalMode: 'create' | 'view' | 'assign' = 'create';
  modalTitle = 'New Emergency Event';
  selectedEvent: EmergencyEvent = this.getEmptyEvent();
  selectedUnitId: number | null = null;

  constructor(
    private emergencyService: EmergencyService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.loadUnits();
  }

  loadEvents(): void {
    this.loading = true;
    this.emergencyService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.filterEvents();
        this.loading = false;
      },
      error: (err) => {
        this.toastService.error('Failed to load events');
        this.loading = false;
      }
    });
  }

  loadUnits(): void {
    this.emergencyService.getUnits().subscribe({
      next: (data) => {
        this.units = data;
        this.availableUnits = data.filter(u => u.status === 'AVAILABLE');
      }
    });
  }

  filterEvents(): void {
    if (!this.searchTerm) {
      this.filteredEvents = [...this.events];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredEvents = this.events.filter(e =>
        e.description?.toLowerCase().includes(term) ||
        e.severity?.toLowerCase().includes(term) ||
        e.status?.toLowerCase().includes(term) ||
        e.location?.address?.toLowerCase().includes(term)
      );
    }
  }

  getEmptyEvent(): EmergencyEvent {
    return {
      description: '',
      severity: 'MEDIUM',
      status: 'OPEN',
      location: { latitude: 0, longitude: 0, address: '' }
    };
  }

  openCreateModal(): void {
    this.selectedEvent = this.getEmptyEvent();
    this.modalMode = 'create';
    this.modalTitle = 'New Emergency Event';
    this.modalOpen = true;
  }

  viewEvent(event: EmergencyEvent): void {
    this.selectedEvent = { ...event };
    this.modalMode = 'view';
    this.modalTitle = 'Event Details';
    this.modalOpen = true;
  }

  openAssignModal(event: EmergencyEvent): void {
    this.selectedEvent = { ...event };
    this.selectedUnitId = event.assignedUnitId || null;
    this.modalMode = 'assign';
    this.modalTitle = 'Assign Unit to Event';
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selectedEvent = this.getEmptyEvent();
    this.selectedUnitId = null;
  }

  saveEvent(): void {
    if (this.modalMode === 'assign') {
      if (this.selectedUnitId && this.selectedEvent.id) {
        this.emergencyService.assignUnitToEvent(this.selectedEvent.id, this.selectedUnitId).subscribe({
          next: () => {
            this.toastService.success('Unit assigned successfully');
            this.loadEvents();
            this.closeModal();
          },
          error: () => {
            this.toastService.error('Failed to assign unit');
          }
        });
      }
    } else {
      this.emergencyService.createEvent(this.selectedEvent).subscribe({
        next: () => {
          this.toastService.success('Event created successfully');
          this.loadEvents();
          this.closeModal();
        },
        error: () => {
          this.toastService.error('Failed to create event');
        }
      });
    }
  }

  deleteEvent(event: EmergencyEvent): void {
    if (confirm(`Are you sure you want to delete this event?`)) {
      this.emergencyService.deleteEvent(event.id!).subscribe({
        next: () => {
          this.toastService.success('Event deleted successfully');
          this.loadEvents();
        },
        error: () => {
          this.toastService.error('Failed to delete event');
        }
      });
    }
  }

  getSeverityClass(severity: string): string {
    return severity?.toLowerCase() || 'low';
  }

  getStatusClass(status: string): string {
    return status?.toLowerCase().replace(' ', '_') || 'open';
  }

  getUnitName(unitId?: number): string {
    if (!unitId) return 'Not assigned';
    const unit = this.units.find(u => u.id === unitId);
    return unit ? unit.name : `Unit #${unitId}`;
  }

  formatLocation(location?: Location): string {
    if (!location) return '-';
    if (location.latitude && location.longitude) {
      return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
    }
    return '-';
  }
}
