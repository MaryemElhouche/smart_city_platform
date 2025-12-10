import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MobilityService } from '../../services/mobility.service';
import { ToastService } from '../../services/toast.service';
import { TransportLine } from '../../models/mobility.models';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-lines',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <div class="lines-page">
      <div class="page-header">
        <h2>Transport Lines</h2>
        <div class="page-header-actions">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="filterLines()" placeholder="Search by line number...">
          </div>
          <button class="btn btn-secondary" (click)="loadLines()">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
          <button class="btn btn-primary" (click)="openCreateModal()">
            <i class="fas fa-plus"></i> Add Line
          </button>
        </div>
      </div>

      @if (loading) {
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
      } @else if (filteredLines.length === 0) {
        <div class="card">
          <div class="card-body">
            <div class="empty-state">
              <i class="fas fa-route"></i>
              <h4>No lines found</h4>
              <p>{{ searchTerm ? 'No lines match your search' : 'Create your first transport line to get started' }}</p>
            </div>
          </div>
        </div>
      } @else {
        <div class="data-grid">
          @for (line of filteredLines; track line.id) {
            <div class="data-card">
              <div class="data-card-header">
                <i class="fas" [ngClass]="getLineIcon(line.type)"></i>
                <span class="status-badge active">{{ line.type || 'Line' }}</span>
              </div>
              <div class="data-card-body">
                <h4>{{ line.lineNumber || 'Line #' + line.id }}</h4>
                <p><i class="fas fa-map-marker-alt"></i> {{ line.stations?.length || 0 }} stations</p>
              </div>
              <div class="data-card-footer">
                <button class="btn btn-sm btn-secondary" (click)="viewLine(line)">
                  <i class="fas fa-eye"></i> Details
                </button>
                <button class="btn btn-sm btn-primary" (click)="editLine(line)">
                  <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-sm btn-danger" (click)="deleteLine(line)">
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
        (saved)="saveLine()">
        
        @if (modalMode === 'view') {
          <div class="detail-view">
            <div class="detail-row"><strong>ID:</strong> {{ selectedLine.id }}</div>
            <div class="detail-row"><strong>Line Number:</strong> {{ selectedLine.lineNumber || '-' }}</div>
            <div class="detail-row"><strong>Type:</strong> {{ selectedLine.type || '-' }}</div>
            <div class="detail-row"><strong>Stations:</strong> {{ selectedLine.stations?.length || 0 }}</div>
          </div>
        } @else {
          <div class="form-group">
            <label for="lineNumber">Line Number</label>
            <input type="text" id="lineNumber" [(ngModel)]="selectedLine.lineNumber" placeholder="Enter line number (e.g., L1, M2, B5)" required>
          </div>
          <div class="form-group">
            <label for="type">Line Type</label>
            <select id="type" [(ngModel)]="selectedLine.type" required>
              <option value="">Select type...</option>
              <option value="BUS">Bus</option>
              <option value="METRO">Metro</option>
              <option value="TRAIN">Train</option>
            </select>
          </div>
        }
      </app-modal>
    </div>
  `
})
export class LinesComponent implements OnInit {
  lines: TransportLine[] = [];
  filteredLines: TransportLine[] = [];
  searchTerm = '';
  loading = true;
  modalOpen = false;
  modalMode: 'create' | 'edit' | 'view' = 'create';
  modalTitle = 'Create Line';
  selectedLine: TransportLine = this.getEmptyLine();

  constructor(
    private mobilityService: MobilityService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadLines();
  }

  loadLines(): void {
    this.loading = true;
    this.mobilityService.getLines().subscribe({
      next: (data) => {
        this.lines = data;
        this.filterLines();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.toastService.error('Failed to load lines');
        console.error(err);
      }
    });
  }

  filterLines(): void {
    if (!this.searchTerm.trim()) {
      this.filteredLines = [...this.lines];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredLines = this.lines.filter(l => 
        l.lineNumber?.toLowerCase().includes(term) ||
        l.type?.toLowerCase().includes(term)
      );
    }
  }

  getEmptyLine(): TransportLine {
    return { lineNumber: '', type: '' };
  }

  getLineIcon(type: string | undefined): string {
    const icons: { [key: string]: string } = {
      'BUS': 'fa-bus',
      'METRO': 'fa-subway',
      'TRAIN': 'fa-train'
    };
    return icons[type?.toUpperCase() || ''] || 'fa-route';
  }

  openCreateModal(): void {
    this.selectedLine = this.getEmptyLine();
    this.modalMode = 'create';
    this.modalTitle = 'Create Line';
    this.modalOpen = true;
  }

  viewLine(line: TransportLine): void {
    this.selectedLine = { ...line };
    this.modalMode = 'view';
    this.modalTitle = 'Line Details';
    this.modalOpen = true;
  }

  editLine(line: TransportLine): void {
    this.selectedLine = { ...line };
    this.modalMode = 'edit';
    this.modalTitle = 'Edit Line';
    this.modalOpen = true;
  }

  deleteLine(line: TransportLine): void {
    if (confirm('Are you sure you want to delete this line?')) {
      this.mobilityService.deleteLine(line.id!).subscribe({
        next: () => {
          this.toastService.success('Line deleted successfully');
          this.loadLines();
        },
        error: (err) => {
          this.toastService.error('Failed to delete line');
          console.error(err);
        }
      });
    }
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  saveLine(): void {
    if (this.modalMode === 'create') {
      this.mobilityService.createLine(this.selectedLine).subscribe({
        next: () => {
          this.toastService.success('Line created successfully');
          this.closeModal();
          this.loadLines();
        },
        error: (err) => {
          this.toastService.error('Failed to create line');
          console.error(err);
        }
      });
    } else if (this.modalMode === 'edit') {
      this.mobilityService.updateLine(this.selectedLine.id!, this.selectedLine).subscribe({
        next: () => {
          this.toastService.success('Line updated successfully');
          this.closeModal();
          this.loadLines();
        },
        error: (err) => {
          this.toastService.error('Failed to update line');
          console.error(err);
        }
      });
    }
  }
}
