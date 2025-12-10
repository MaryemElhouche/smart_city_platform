import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MobilityService } from '../../services/mobility.service';
import { DashboardStats } from '../../models/mobility.models';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card blue" routerLink="/transports">
          <div class="stat-icon">
            <i class="fas fa-bus"></i>
          </div>
          <div class="stat-info">
            <h3>{{ stats.transports }}</h3>
            <p>Total Transports</p>
          </div>
        </div>
        
        <div class="stat-card green" routerLink="/lines">
          <div class="stat-icon">
            <i class="fas fa-route"></i>
          </div>
          <div class="stat-info">
            <h3>{{ stats.lines }}</h3>
            <p>Transport Lines</p>
          </div>
        </div>
        
        <div class="stat-card purple" routerLink="/stations">
          <div class="stat-icon">
            <i class="fas fa-map-pin"></i>
          </div>
          <div class="stat-info">
            <h3>{{ stats.stations }}</h3>
            <p>Stations</p>
          </div>
        </div>
        
        <div class="stat-card pink" routerLink="/vehicles">
          <div class="stat-icon">
            <i class="fas fa-car"></i>
          </div>
          <div class="stat-info">
            <h3>{{ stats.vehicles }}</h3>
            <p>Vehicles</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <h3 class="section-title"><i class="fas fa-bolt"></i> Quick Actions</h3>
      <div class="quick-actions">
        <button class="quick-action-btn" routerLink="/transports">
          <i class="fas fa-plus"></i>
          <span class="action-label">Add Transport</span>
        </button>
        <button class="quick-action-btn" routerLink="/lines">
          <i class="fas fa-plus"></i>
          <span class="action-label">Add Line</span>
        </button>
        <button class="quick-action-btn" routerLink="/stations">
          <i class="fas fa-plus"></i>
          <span class="action-label">Add Station</span>
        </button>
        <button class="quick-action-btn" routerLink="/vehicles">
          <i class="fas fa-plus"></i>
          <span class="action-label">Add Vehicle</span>
        </button>
      </div>

      <!-- Recent Transports -->
      <div class="card">
        <div class="card-header">
          <h3><i class="fas fa-clock"></i> Recent Transports</h3>
          <button class="btn btn-sm btn-secondary" (click)="loadStats()">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
        <div class="card-body">
          @if (loading) {
            <div class="loading-spinner">
              <div class="spinner"></div>
            </div>
          } @else if (stats.recentTransports.length === 0) {
            <div class="empty-state">
              <i class="fas fa-bus"></i>
              <h4>No transports yet</h4>
              <p>Create your first transport to get started</p>
            </div>
          } @else {
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                @for (transport of stats.recentTransports; track transport.id) {
                  <tr>
                    <td>{{ transport.id }}</td>
                    <td>{{ transport.origin || '-' }}</td>
                    <td>{{ transport.destination || '-' }}</td>
                    <td>
                      <span class="status-badge" [ngClass]="getStatusClass(transport.status)">
                        {{ transport.status || 'Unknown' }}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--gray-700);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-title i {
      color: var(--gray-500);
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    transports: 0,
    lines: 0,
    stations: 0,
    vehicles: 0,
    recentTransports: []
  };
  loading = true;

  constructor(
    private mobilityService: MobilityService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  getStatusClass(status: string | undefined): string {
    const statusMap: { [key: string]: string } = {
      'ON_TIME': 'active',
      'DELAYED': 'maintenance',
      'CANCELLED': 'inactive'
    };
    return statusMap[status || ''] || 'unknown';
  }

  loadStats(): void {
    this.loading = true;
    this.mobilityService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.toastService.error('Failed to load dashboard data');
        console.error(err);
      }
    });
  }
}
