import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MobilityService } from '../../services/mobility.service';
import { ToastService } from '../../services/toast.service';
import { Station, TransportLine } from '../../models/mobility.models';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-stations',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <div class="stations-page">
      <div class="page-header">
        <h2>Stations</h2>
        <div class="page-header-actions">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="filterStations()" placeholder="Search by name...">
          </div>
          <button class="btn btn-secondary" (click)="loadStations()">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
          <button class="btn btn-primary" (click)="openCreateModal()">
            <i class="fas fa-plus"></i> Add Station
          </button>
        </div>
      </div>

      @if (loading) {
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
      } @else if (filteredStations.length === 0) {
        <div class="card">
          <div class="card-body">
            <div class="empty-state">
              <i class="fas fa-map-pin"></i>
              <h4>No stations found</h4>
              <p>{{ searchTerm ? 'No stations match your search' : 'Create your first station to get started' }}</p>
            </div>
          </div>
        </div>
      } @else {
        <div class="data-grid">
          @for (station of filteredStations; track station.id) {
            <div class="data-card">
              <div class="data-card-header">
                <i class="fas fa-map-pin"></i>
                <span class="status-badge active">Station</span>
              </div>
              <div class="data-card-body">
                <h4>{{ station.name || 'Unnamed Station' }}</h4>
                <p><i class="fas fa-route"></i> Line: {{ getLineName(station.lineId) }}</p>
                <p><i class="fas fa-globe"></i> {{ station.latitude || '-' }}, {{ station.longitude || '-' }}</p>
              </div>
              <div class="data-card-footer">
                <button class="btn btn-sm btn-secondary" (click)="viewStation(station)">
                  <i class="fas fa-eye"></i> Details
                </button>
                <button class="btn btn-sm btn-primary" (click)="editStation(station)">
                  <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-sm btn-danger" (click)="deleteStation(station)">
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
        (saved)="saveStation()">
        
        @if (modalMode === 'view') {
          <div class="detail-view">
            <div class="detail-row"><strong>ID:</strong> {{ selectedStation.id }}</div>
            <div class="detail-row"><strong>Name:</strong> {{ selectedStation.name || '-' }}</div>
            <div class="detail-row"><strong>Line:</strong> {{ getLineName(selectedStation.lineId) }}</div>
            <div class="detail-row"><strong>Coordinates:</strong> {{ selectedStation.latitude || '-' }}, {{ selectedStation.longitude || '-' }}</div>
          </div>
        } @else {
          <div class="form-group">
            <label for="name">Station Name</label>
            <input type="text" id="name" [(ngModel)]="selectedStation.name" placeholder="Enter station name" required>
          </div>
          <div class="form-group">
            <label for="lineId">Line</label>
            <select id="lineId" [(ngModel)]="selectedStation.lineId">
              <option [ngValue]="null">No line</option>
              @for (line of lines; track line.id) {
                <option [ngValue]="line.id">{{ line.lineNumber }} ({{ line.type }})</option>
              }
            </select>
          </div>
          <div class="form-group">
            <label for="latitude">Latitude</label>
            <input type="number" id="latitude" [(ngModel)]="selectedStation.latitude" step="any" placeholder="e.g., 36.8065">
          </div>
          <div class="form-group">
            <label for="longitude">Longitude</label>
            <input type="number" id="longitude" [(ngModel)]="selectedStation.longitude" step="any" placeholder="e.g., 10.1815">
          </div>
        }
      </app-modal>
    </div>
  `
})
export class StationsComponent implements OnInit {
  stations: Station[] = [];
  filteredStations: Station[] = [];
  lines: TransportLine[] = [];
  searchTerm = '';
  loading = true;
  modalOpen = false;
  modalMode: 'create' | 'edit' | 'view' = 'create';
  modalTitle = 'Create Station';
  selectedStation: Station = this.getEmptyStation();

  constructor(
    private mobilityService: MobilityService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadStations();
    this.loadLines();
  }

  loadStations(): void {
    this.loading = true;
    this.mobilityService.getStations().subscribe({
      next: (data) => {
        this.stations = data;
        this.filterStations();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.toastService.error('Failed to load stations');
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

  filterStations(): void {
    if (!this.searchTerm.trim()) {
      this.filteredStations = [...this.stations];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredStations = this.stations.filter(s => 
        s.name?.toLowerCase().includes(term)
      );
    }
  }

  getLineName(lineId: number | undefined): string {
    if (!lineId) return '-';
    const line = this.lines.find(l => l.id === lineId);
    return line ? `${line.lineNumber} (${line.type})` : `Line #${lineId}`;
  }

  getEmptyStation(): Station {
    return { name: '' };
  }

  openCreateModal(): void {
    this.selectedStation = this.getEmptyStation();
    this.modalMode = 'create';
    this.modalTitle = 'Create Station';
    this.modalOpen = true;
  }

  viewStation(station: Station): void {
    this.selectedStation = { ...station };
    this.modalMode = 'view';
    this.modalTitle = 'Station Details';
    this.modalOpen = true;
  }

  editStation(station: Station): void {
    this.selectedStation = { ...station };
    this.modalMode = 'edit';
    this.modalTitle = 'Edit Station';
    this.modalOpen = true;
  }

  deleteStation(station: Station): void {
    if (confirm('Are you sure you want to delete this station?')) {
      this.mobilityService.deleteStation(station.id!).subscribe({
        next: () => {
          this.toastService.success('Station deleted successfully');
          this.loadStations();
        },
        error: (err) => {
          this.toastService.error('Failed to delete station');
          console.error(err);
        }
      });
    }
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  saveStation(): void {
    if (this.modalMode === 'create') {
      this.mobilityService.createStation(this.selectedStation).subscribe({
        next: () => {
          this.toastService.success('Station created successfully');
          this.closeModal();
          this.loadStations();
        },
        error: (err) => {
          this.toastService.error('Failed to create station');
          console.error(err);
        }
      });
    } else if (this.modalMode === 'edit') {
      this.mobilityService.updateStation(this.selectedStation.id!, this.selectedStation).subscribe({
        next: () => {
          this.toastService.success('Station updated successfully');
          this.closeModal();
          this.loadStations();
        },
        error: (err) => {
          this.toastService.error('Failed to update station');
          console.error(err);
        }
      });
    }
  }
}
