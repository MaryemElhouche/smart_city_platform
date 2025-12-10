import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MobilityService } from '../../services/mobility.service';
import { ToastService } from '../../services/toast.service';
import { Vehicle } from '../../models/mobility.models';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <div class="vehicles-page">
      <div class="page-header">
        <h2>Vehicle Fleet</h2>
        <div class="page-header-actions">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="filterVehicles()" placeholder="Search by registration...">
          </div>
          <button class="btn btn-secondary" (click)="loadVehicles()">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
          <button class="btn btn-primary" (click)="openCreateModal()">
            <i class="fas fa-plus"></i> Add Vehicle
          </button>
        </div>
      </div>

      @if (loading) {
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
      } @else if (filteredVehicles.length === 0) {
        <div class="card">
          <div class="card-body">
            <div class="empty-state">
              <i class="fas fa-car"></i>
              <h4>No vehicles found</h4>
              <p>{{ searchTerm ? 'No vehicles match your search' : 'Add your first vehicle to the fleet' }}</p>
            </div>
          </div>
        </div>
      } @else {
        <div class="data-grid">
          @for (vehicle of filteredVehicles; track vehicle.id) {
            <div class="data-card">
              <div class="data-card-header">
                <i class="fas fa-car"></i>
                <span class="status-badge" [ngClass]="vehicle.status?.toLowerCase()">
                  {{ vehicle.status || 'Unknown' }}
                </span>
              </div>
              <div class="data-card-body">
                <h4>{{ vehicle.registrationNumber || 'Vehicle #' + vehicle.id }}</h4>
                <p><i class="fas fa-users"></i> Capacity: {{ vehicle.capacity || '-' }}</p>
              </div>
              <div class="data-card-footer">
                <button class="btn btn-sm btn-secondary" (click)="viewVehicle(vehicle)">
                  <i class="fas fa-eye"></i> Details
                </button>
                <button class="btn btn-sm btn-primary" (click)="editVehicle(vehicle)">
                  <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-sm btn-danger" (click)="deleteVehicle(vehicle)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          }
        </div>
      }

      <!-- Modal -->
      <app-modal 
        [isOpen]="modalOpen" 
        [title]="modalTitle" 
        [viewOnly]="modalMode === 'view'"
        (closed)="closeModal()" 
        (saved)="saveVehicle()">
        
        @if (modalMode === 'view') {
          <div class="detail-view">
            <div class="detail-row"><strong>ID:</strong> {{ selectedVehicle.id }}</div>
            <div class="detail-row"><strong>Registration Number:</strong> {{ selectedVehicle.registrationNumber || '-' }}</div>
            <div class="detail-row"><strong>Capacity:</strong> {{ selectedVehicle.capacity || '-' }}</div>
            <div class="detail-row"><strong>Status:</strong> 
              <span class="status-badge" [ngClass]="selectedVehicle.status?.toLowerCase()">
                {{ selectedVehicle.status || '-' }}
              </span>
            </div>
          </div>
        } @else {
          <div class="form-group">
            <label for="registrationNumber">Registration Number</label>
            <input type="text" id="registrationNumber" [(ngModel)]="selectedVehicle.registrationNumber" placeholder="Enter registration number" required>
          </div>
          <div class="form-group">
            <label for="capacity">Capacity</label>
            <input type="number" id="capacity" [(ngModel)]="selectedVehicle.capacity" placeholder="Enter capacity" min="1">
          </div>
          <div class="form-group">
            <label for="status">Status</label>
            <select id="status" [(ngModel)]="selectedVehicle.status" required>
              <option value="ACTIVE">Active</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
            </select>
          </div>
        }
      </app-modal>
    </div>
  `
})
export class VehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  filteredVehicles: Vehicle[] = [];
  searchTerm = '';
  loading = true;
  modalOpen = false;
  modalMode: 'create' | 'edit' | 'view' = 'create';
  modalTitle = 'Create Vehicle';
  selectedVehicle: Vehicle = this.getEmptyVehicle();

  constructor(
    private mobilityService: MobilityService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.loading = true;
    this.mobilityService.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.filterVehicles();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.toastService.error('Failed to load vehicles');
        console.error(err);
      }
    });
  }

  filterVehicles(): void {
    if (!this.searchTerm.trim()) {
      this.filteredVehicles = [...this.vehicles];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredVehicles = this.vehicles.filter(v => 
        v.registrationNumber?.toLowerCase().includes(term) ||
        v.status?.toLowerCase().includes(term)
      );
    }
  }

  getEmptyVehicle(): Vehicle {
    return { registrationNumber: '', status: 'ACTIVE' };
  }

  openCreateModal(): void {
    this.selectedVehicle = this.getEmptyVehicle();
    this.modalMode = 'create';
    this.modalTitle = 'Create Vehicle';
    this.modalOpen = true;
  }

  viewVehicle(vehicle: Vehicle): void {
    this.selectedVehicle = { ...vehicle };
    this.modalMode = 'view';
    this.modalTitle = 'Vehicle Details';
    this.modalOpen = true;
  }

  editVehicle(vehicle: Vehicle): void {
    this.selectedVehicle = { ...vehicle };
    this.modalMode = 'edit';
    this.modalTitle = 'Edit Vehicle';
    this.modalOpen = true;
  }

  deleteVehicle(vehicle: Vehicle): void {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.mobilityService.deleteVehicle(vehicle.id!).subscribe({
        next: () => {
          this.toastService.success('Vehicle deleted successfully');
          this.loadVehicles();
        },
        error: (err) => {
          this.toastService.error('Failed to delete vehicle');
          console.error(err);
        }
      });
    }
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  saveVehicle(): void {
    if (this.modalMode === 'create') {
      this.mobilityService.createVehicle(this.selectedVehicle).subscribe({
        next: () => {
          this.toastService.success('Vehicle created successfully');
          this.closeModal();
          this.loadVehicles();
        },
        error: (err) => {
          this.toastService.error('Failed to create vehicle');
          console.error(err);
        }
      });
    } else if (this.modalMode === 'edit') {
      this.mobilityService.updateVehicle(this.selectedVehicle.id!, this.selectedVehicle).subscribe({
        next: () => {
          this.toastService.success('Vehicle updated successfully');
          this.closeModal();
          this.loadVehicles();
        },
        error: (err) => {
          this.toastService.error('Failed to update vehicle');
          console.error(err);
        }
      });
    }
  }
}
