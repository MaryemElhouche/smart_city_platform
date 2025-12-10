import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MobilityService } from '../../services/mobility.service';
import { ToastService } from '../../services/toast.service';
import { Transport, TransportLine, Vehicle } from '../../models/mobility.models';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-transports',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <div class="transports-page">
      <div class="page-header">
        <h2>Transports</h2>
        <div class="page-header-actions">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="filterTransports()" placeholder="Search by origin/destination...">
          </div>
          <button class="btn btn-secondary" (click)="loadTransports()">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
          <button class="btn btn-primary" (click)="openCreateModal()">
            <i class="fas fa-plus"></i> Add Transport
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          @if (loading) {
            <div class="loading-spinner">
              <div class="spinner"></div>
            </div>
          } @else if (filteredTransports.length === 0) {
            <div class="empty-state">
              <i class="fas fa-bus"></i>
              <h4>No transports found</h4>
              <p>{{ searchTerm ? 'No transports match your search' : 'Create your first transport to get started' }}</p>
            </div>
          } @else {
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>Departure</th>
                  <th>Status</th>
                  <th>Delay</th>
                  <th>Seats</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (transport of filteredTransports; track transport.id) {
                  <tr>
                    <td>{{ transport.id }}</td>
                    <td>{{ transport.origin || '-' }}</td>
                    <td>{{ transport.destination || '-' }}</td>
                    <td>{{ formatDateTime(transport.departureTime) }}</td>
                    <td>
                      <span class="status-badge" [ngClass]="getStatusClass(transport.status)">
                        {{ transport.status || 'Unknown' }}
                      </span>
                    </td>
                    <td>{{ transport.delayMinutes ? transport.delayMinutes + ' min' : '-' }}</td>
                    <td>{{ transport.availableSeats ?? '-' }}</td>
                    <td>
                      <div class="action-buttons">
                        <button class="btn-icon btn-view" (click)="viewTransport(transport)" title="View">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon btn-edit" (click)="editTransport(transport)" title="Edit">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-delete" (click)="deleteTransport(transport)" title="Delete">
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
        (saved)="saveTransport()">
        
        @if (modalMode === 'view') {
          <div class="detail-view">
            <div class="detail-row"><strong>ID:</strong> {{ selectedTransport.id }}</div>
            <div class="detail-row"><strong>Origin:</strong> {{ selectedTransport.origin || '-' }}</div>
            <div class="detail-row"><strong>Destination:</strong> {{ selectedTransport.destination || '-' }}</div>
            <div class="detail-row"><strong>Departure:</strong> {{ formatDateTime(selectedTransport.departureTime) }}</div>
            <div class="detail-row"><strong>Arrival:</strong> {{ formatDateTime(selectedTransport.arrivalTime) }}</div>
            <div class="detail-row"><strong>Status:</strong> 
              <span class="status-badge" [ngClass]="getStatusClass(selectedTransport.status)">
                {{ selectedTransport.status || '-' }}
              </span>
            </div>
            <div class="detail-row"><strong>Delay:</strong> {{ selectedTransport.delayMinutes ? selectedTransport.delayMinutes + ' min' : '-' }}</div>
            <div class="detail-row"><strong>Available Seats:</strong> {{ selectedTransport.availableSeats ?? '-' }}</div>
            <div class="detail-row"><strong>Line ID:</strong> {{ selectedTransport.lineId || '-' }}</div>
            <div class="detail-row"><strong>Vehicle ID:</strong> {{ selectedTransport.vehicleId || '-' }}</div>
          </div>
        } @else {
          <div class="form-group">
            <label for="origin">Origin</label>
            <input type="text" id="origin" [(ngModel)]="selectedTransport.origin" placeholder="Enter origin">
          </div>
          <div class="form-group">
            <label for="destination">Destination</label>
            <input type="text" id="destination" [(ngModel)]="selectedTransport.destination" placeholder="Enter destination">
          </div>
          <div class="form-group">
            <label for="departureTime">Departure Time</label>
            <input type="datetime-local" id="departureTime" [(ngModel)]="selectedTransport.departureTime">
          </div>
          <div class="form-group">
            <label for="arrivalTime">Arrival Time</label>
            <input type="datetime-local" id="arrivalTime" [(ngModel)]="selectedTransport.arrivalTime">
          </div>
          <div class="form-group">
            <label for="status">Status</label>
            <select id="status" [(ngModel)]="selectedTransport.status" required>
              <option value="ON_TIME">On Time</option>
              <option value="DELAYED">Delayed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div class="form-group">
            <label for="delayMinutes">Delay (minutes)</label>
            <input type="number" id="delayMinutes" [(ngModel)]="selectedTransport.delayMinutes" placeholder="0" min="0">
          </div>
          <div class="form-group">
            <label for="availableSeats">Available Seats</label>
            <input type="number" id="availableSeats" [(ngModel)]="selectedTransport.availableSeats" placeholder="Enter available seats" min="0">
          </div>
          <div class="form-group">
            <label for="lineId">Line</label>
            <select id="lineId" [(ngModel)]="selectedTransport.lineId">
              <option [ngValue]="null">No line</option>
              @for (line of lines; track line.id) {
                <option [ngValue]="line.id">{{ line.lineNumber }} ({{ line.type }})</option>
              }
            </select>
          </div>
          <div class="form-group">
            <label for="vehicleId">Vehicle</label>
            <select id="vehicleId" [(ngModel)]="selectedTransport.vehicleId">
              <option [ngValue]="null">No vehicle</option>
              @for (vehicle of vehicles; track vehicle.id) {
                <option [ngValue]="vehicle.id">{{ vehicle.registrationNumber }}</option>
              }
            </select>
          </div>
        }
      </app-modal>
    </div>
  `
})
export class TransportsComponent implements OnInit {
  transports: Transport[] = [];
  filteredTransports: Transport[] = [];
  lines: TransportLine[] = [];
  vehicles: Vehicle[] = [];
  searchTerm = '';
  loading = true;
  modalOpen = false;
  modalMode: 'create' | 'edit' | 'view' = 'create';
  modalTitle = 'Create Transport';
  selectedTransport: Transport = this.getEmptyTransport();

  constructor(
    private mobilityService: MobilityService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadTransports();
    this.loadLines();
    this.loadVehicles();
  }

  loadTransports(): void {
    this.loading = true;
    this.mobilityService.getTransports().subscribe({
      next: (data) => {
        this.transports = data;
        this.filterTransports();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.toastService.error('Failed to load transports');
        console.error(err);
      }
    });
  }

  loadLines(): void {
    this.mobilityService.getLines().subscribe({
      next: (data) => this.lines = data,
      error: (err) => console.error('Failed to load lines', err)
    });
  }

  loadVehicles(): void {
    this.mobilityService.getVehicles().subscribe({
      next: (data) => this.vehicles = data,
      error: (err) => console.error('Failed to load vehicles', err)
    });
  }

  filterTransports(): void {
    if (!this.searchTerm.trim()) {
      this.filteredTransports = [...this.transports];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredTransports = this.transports.filter(t => 
        t.origin?.toLowerCase().includes(term) ||
        t.destination?.toLowerCase().includes(term) ||
        t.status?.toLowerCase().includes(term)
      );
    }
  }

  getEmptyTransport(): Transport {
    return { status: 'ON_TIME' };
  }

  getStatusClass(status: string | undefined): string {
    const statusMap: { [key: string]: string } = {
      'ON_TIME': 'active',
      'DELAYED': 'maintenance',
      'CANCELLED': 'inactive'
    };
    return statusMap[status || ''] || 'unknown';
  }

  formatDateTime(dateTime: string | undefined): string {
    if (!dateTime) return '-';
    try {
      const date = new Date(dateTime);
      return date.toLocaleString('fr-FR', { 
        dateStyle: 'short', 
        timeStyle: 'short' 
      });
    } catch {
      return dateTime;
    }
  }

  openCreateModal(): void {
    this.selectedTransport = this.getEmptyTransport();
    this.modalMode = 'create';
    this.modalTitle = 'Create Transport';
    this.modalOpen = true;
  }

  viewTransport(transport: Transport): void {
    this.selectedTransport = { ...transport };
    this.modalMode = 'view';
    this.modalTitle = 'Transport Details';
    this.modalOpen = true;
  }

  editTransport(transport: Transport): void {
    this.selectedTransport = { ...transport };
    this.modalMode = 'edit';
    this.modalTitle = 'Edit Transport';
    this.modalOpen = true;
  }

  deleteTransport(transport: Transport): void {
    if (confirm('Are you sure you want to delete this transport?')) {
      this.mobilityService.deleteTransport(transport.id!).subscribe({
        next: () => {
          this.toastService.success('Transport deleted successfully');
          this.loadTransports();
        },
        error: (err) => {
          this.toastService.error('Failed to delete transport');
          console.error(err);
        }
      });
    }
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  saveTransport(): void {
    if (this.modalMode === 'create') {
      this.mobilityService.createTransport(this.selectedTransport).subscribe({
        next: () => {
          this.toastService.success('Transport created successfully');
          this.closeModal();
          this.loadTransports();
        },
        error: (err) => {
          this.toastService.error('Failed to create transport');
          console.error(err);
        }
      });
    } else if (this.modalMode === 'edit') {
      this.mobilityService.updateTransport(this.selectedTransport.id!, this.selectedTransport).subscribe({
        next: () => {
          this.toastService.success('Transport updated successfully');
          this.closeModal();
          this.loadTransports();
        },
        error: (err) => {
          this.toastService.error('Failed to update transport');
          console.error(err);
        }
      });
    }
  }
}
