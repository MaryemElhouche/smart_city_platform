import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmergencyService } from '../../../services/emergency.service';
import { ToastService } from '../../../services/toast.service';
import { IncidentLog, EmergencyUnit, EmergencyEvent, Resource } from '../../../models/emergency.models';
import { ModalComponent } from '../../../components/modal/modal.component';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <div class="logs-page">
      <div class="page-header">
        <h2>Incident Logs</h2>
        <div class="page-header-actions">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="filterLogs()" placeholder="Search logs...">
          </div>
          <button class="btn btn-secondary" (click)="loadLogs()">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
          <button class="btn btn-primary" (click)="openCreateModal()">
            <i class="fas fa-plus"></i> New Log
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          @if (loading) {
            <div class="loading-spinner">
              <div class="spinner"></div>
            </div>
          } @else if (filteredLogs.length === 0) {
            <div class="empty-state">
              <i class="fas fa-clipboard-list"></i>
              <h4>No logs found</h4>
              <p>{{ searchTerm ? 'No logs match your search' : 'Create an incident log to get started' }}</p>
            </div>
          } @else {
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Timestamp</th>
                  <th>Message</th>
                  <th>Event</th>
                  <th>Unit</th>
                  <th>Resource</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (log of filteredLogs; track log.id) {
                  <tr>
                    <td>{{ log.id }}</td>
                    <td>
                      <span class="timestamp">{{ formatTimestamp(log.timestamp) }}</span>
                    </td>
                    <td>
                      <span class="log-message">{{ log.message | slice:0:60 }}{{ log.message && log.message.length > 60 ? '...' : '' }}</span>
                    </td>
                    <td>{{ log.eventId ? '#' + log.eventId : '-' }}</td>
                    <td>{{ getUnitName(log.unitId) }}</td>
                    <td>{{ getResourceName(log.resourceId) }}</td>
                    <td>
                      <div class="action-buttons">
                        <button class="btn-icon btn-view" (click)="viewLog(log)" title="View">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon btn-edit" (click)="editLog(log)" title="Edit">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-delete" (click)="deleteLog(log)" title="Delete">
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
        (saved)="saveLog()">
        
        @if (modalMode === 'view') {
          <div class="detail-view">
            <div class="detail-row"><strong>ID:</strong> {{ selectedLog.id }}</div>
            <div class="detail-row"><strong>Timestamp:</strong> {{ formatTimestamp(selectedLog.timestamp) }}</div>
            <div class="detail-row"><strong>Message:</strong></div>
            <div class="message-box">{{ selectedLog.message }}</div>
            <div class="detail-row"><strong>Event:</strong> {{ selectedLog.eventId ? '#' + selectedLog.eventId : 'Not linked' }}</div>
            <div class="detail-row"><strong>Unit:</strong> {{ getUnitName(selectedLog.unitId) }}</div>
            <div class="detail-row"><strong>Resource:</strong> {{ getResourceName(selectedLog.resourceId) }}</div>
          </div>
        } @else {
          <div class="form-group">
            <label for="message">Message *</label>
            <textarea id="message" [(ngModel)]="selectedLog.message" placeholder="Enter incident log details..." rows="4" required></textarea>
          </div>
          <div class="form-group">
            <label for="eventId">Related Event</label>
            <select id="eventId" [(ngModel)]="selectedLog.eventId">
              <option [ngValue]="null">No event</option>
              @for (event of events; track event.id) {
                <option [ngValue]="event.id">#{{ event.id }} - {{ event.severity }} - {{ event.description | slice:0:30 }}</option>
              }
            </select>
          </div>
          <div class="form-group">
            <label for="unitId">Related Unit</label>
            <select id="unitId" [(ngModel)]="selectedLog.unitId">
              <option [ngValue]="null">No unit</option>
              @for (unit of units; track unit.id) {
                <option [ngValue]="unit.id">{{ unit.name }} ({{ unit.type }})</option>
              }
            </select>
          </div>
          <div class="form-group">
            <label for="resourceId">Related Resource</label>
            <select id="resourceId" [(ngModel)]="selectedLog.resourceId">
              <option [ngValue]="null">No resource</option>
              @for (resource of resources; track resource.id) {
                <option [ngValue]="resource.id">{{ resource.name }} ({{ resource.type }})</option>
              }
            </select>
          </div>
        }
      </app-modal>
    </div>
  `,
  styles: [`
    .timestamp {
      color: var(--gray-600);
      font-size: 13px;
      font-family: monospace;
    }

    .log-message {
      color: var(--gray-700);
    }

    .message-box {
      background: var(--gray-50);
      padding: 12px;
      border-radius: 8px;
      margin: 8px 0 16px 0;
      color: var(--gray-700);
      line-height: 1.5;
      white-space: pre-wrap;
    }

    textarea {
      resize: vertical;
      min-height: 100px;
    }
  `]
})
export class LogsComponent implements OnInit {
  logs: IncidentLog[] = [];
  filteredLogs: IncidentLog[] = [];
  events: EmergencyEvent[] = [];
  units: EmergencyUnit[] = [];
  resources: Resource[] = [];
  searchTerm = '';
  loading = true;
  modalOpen = false;
  modalMode: 'create' | 'view' | 'edit' = 'create';
  modalTitle = 'New Incident Log';
  selectedLog: IncidentLog = this.getEmptyLog();

  constructor(
    private emergencyService: EmergencyService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadLogs();
    this.loadRelatedData();
  }

  loadLogs(): void {
    this.loading = true;
    this.emergencyService.getLogs().subscribe({
      next: (data) => {
        this.logs = data.sort((a, b) => {
          if (!a.timestamp || !b.timestamp) return 0;
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
        this.filterLogs();
        this.loading = false;
      },
      error: () => {
        this.toastService.error('Failed to load logs');
        this.loading = false;
      }
    });
  }

  loadRelatedData(): void {
    this.emergencyService.getEvents().subscribe({
      next: (data) => this.events = data
    });
    this.emergencyService.getUnits().subscribe({
      next: (data) => this.units = data
    });
    this.emergencyService.getResources().subscribe({
      next: (data) => this.resources = data
    });
  }

  filterLogs(): void {
    if (!this.searchTerm) {
      this.filteredLogs = [...this.logs];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredLogs = this.logs.filter(l =>
        l.message?.toLowerCase().includes(term)
      );
    }
  }

  getEmptyLog(): IncidentLog {
    return {
      message: ''
    };
  }

  openCreateModal(): void {
    this.selectedLog = this.getEmptyLog();
    this.modalMode = 'create';
    this.modalTitle = 'New Incident Log';
    this.modalOpen = true;
  }

  viewLog(log: IncidentLog): void {
    this.selectedLog = { ...log };
    this.modalMode = 'view';
    this.modalTitle = 'Log Details';
    this.modalOpen = true;
  }

  editLog(log: IncidentLog): void {
    this.selectedLog = { ...log };
    this.modalMode = 'edit';
    this.modalTitle = 'Edit Log';
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selectedLog = this.getEmptyLog();
  }

  saveLog(): void {
    if (this.modalMode === 'edit') {
      this.emergencyService.updateLog(this.selectedLog.id!, this.selectedLog).subscribe({
        next: () => {
          this.toastService.success('Log updated successfully');
          this.loadLogs();
          this.closeModal();
        },
        error: () => {
          this.toastService.error('Failed to update log');
        }
      });
    } else {
      this.emergencyService.createLog(this.selectedLog).subscribe({
        next: () => {
          this.toastService.success('Log created successfully');
          this.loadLogs();
          this.closeModal();
        },
        error: () => {
          this.toastService.error('Failed to create log');
        }
      });
    }
  }

  deleteLog(log: IncidentLog): void {
    if (confirm(`Are you sure you want to delete this log?`)) {
      this.emergencyService.deleteLog(log.id!).subscribe({
        next: () => {
          this.toastService.success('Log deleted successfully');
          this.loadLogs();
        },
        error: () => {
          this.toastService.error('Failed to delete log');
        }
      });
    }
  }

  formatTimestamp(timestamp?: string): string {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getUnitName(unitId?: number): string {
    if (!unitId) return '-';
    const unit = this.units.find(u => u.id === unitId);
    return unit ? unit.name : `Unit #${unitId}`;
  }

  getResourceName(resourceId?: number): string {
    if (!resourceId) return '-';
    const resource = this.resources.find(r => r.id === resourceId);
    return resource ? resource.name : `Resource #${resourceId}`;
  }
}
