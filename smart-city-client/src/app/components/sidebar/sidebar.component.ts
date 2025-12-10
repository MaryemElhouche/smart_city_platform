import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar">
      <div class="sidebar-brand">
        <svg width="45" height="45" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="120" height="120" rx="24" fill="url(#gradient)"/>
          <rect x="20" y="50" width="20" height="45" rx="3" fill="#4A5568"/>
          <rect x="25" y="55" width="10" height="8" rx="1" fill="#A8D8EA"/>
          <rect x="25" y="67" width="10" height="8" rx="1" fill="#A8D8EA"/>
          <rect x="25" y="79" width="10" height="8" rx="1" fill="#A8D8EA"/>
          <rect x="50" y="35" width="25" height="60" rx="3" fill="#4A5568"/>
          <rect x="55" y="40" width="7" height="7" rx="1" fill="#FFD3E0"/>
          <rect x="63" y="40" width="7" height="7" rx="1" fill="#FFD3E0"/>
          <rect x="55" y="52" width="7" height="7" rx="1" fill="#DCD0FF"/>
          <rect x="63" y="52" width="7" height="7" rx="1" fill="#DCD0FF"/>
          <rect x="55" y="64" width="7" height="7" rx="1" fill="#A8E6CF"/>
          <rect x="63" y="64" width="7" height="7" rx="1" fill="#A8E6CF"/>
          <rect x="55" y="76" width="15" height="12" rx="2" fill="#A8D8EA"/>
          <rect x="85" y="55" width="18" height="40" rx="3" fill="#4A5568"/>
          <rect x="89" y="60" width="10" height="8" rx="1" fill="#FFFACD"/>
          <rect x="89" y="72" width="10" height="8" rx="1" fill="#FFFACD"/>
          <ellipse cx="45" cy="95" rx="22" ry="8" fill="#2D3748"/>
          <rect x="28" y="82" width="34" height="16" rx="4" fill="#A8D8EA"/>
          <circle cx="35" cy="98" r="5" fill="#2D3748"/>
          <circle cx="55" cy="98" r="5" fill="#2D3748"/>
          <rect x="32" y="86" width="8" height="6" rx="1" fill="#E2E8F0"/>
          <rect x="42" y="86" width="8" height="6" rx="1" fill="#E2E8F0"/>
          <rect x="52" y="86" width="6" height="6" rx="1" fill="#FFB7B2"/>
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop stop-color="#A8D8EA"/>
              <stop offset="1" stop-color="#DCD0FF"/>
            </linearGradient>
          </defs>
        </svg>
        <div>
          <h1>Smart City</h1>
          <span>Platform</span>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <!-- Mobility Section with Submenu -->
        <div class="nav-section">
          <a class="nav-item" (click)="toggleMobility()" [class.expanded]="mobilityExpanded">
            <i class="fas fa-bus"></i>
            <span>Mobility</span>
            <i class="fas fa-chevron-down chevron" [class.rotated]="mobilityExpanded"></i>
          </a>
          <div class="submenu" [class.open]="mobilityExpanded">
            <a routerLink="/mobility/dashboard" routerLinkActive="active">
              <i class="fas fa-th-large"></i>
              <span>Dashboard</span>
            </a>
            <a routerLink="/mobility/transports" routerLinkActive="active">
              <i class="fas fa-bus-alt"></i>
              <span>Transports</span>
            </a>
            <a routerLink="/mobility/lines" routerLinkActive="active">
              <i class="fas fa-route"></i>
              <span>Lines</span>
            </a>
            <a routerLink="/mobility/stations" routerLinkActive="active">
              <i class="fas fa-map-pin"></i>
              <span>Stations</span>
            </a>
            <a routerLink="/mobility/vehicles" routerLinkActive="active">
              <i class="fas fa-car"></i>
              <span>Vehicles</span>
            </a>
          </div>
        </div>

        <!-- Emergency Section -->
        <div class="nav-section">
          <a class="nav-item" (click)="toggleEmergency()" [class.expanded]="emergencyExpanded">
            <i class="fas fa-exclamation-triangle"></i>
            <span>Emergency</span>
            <i class="fas fa-chevron-down chevron" [class.rotated]="emergencyExpanded"></i>
          </a>
          <div class="submenu" [class.open]="emergencyExpanded">
            <a routerLink="/emergency/dashboard" routerLinkActive="active">
              <i class="fas fa-th-large"></i>
              <span>Dashboard</span>
            </a>
            <a routerLink="/emergency/events" routerLinkActive="active">
              <i class="fas fa-exclamation-circle"></i>
              <span>Events</span>
            </a>
            <a routerLink="/emergency/units" routerLinkActive="active">
              <i class="fas fa-users"></i>
              <span>Units</span>
            </a>
            <a routerLink="/emergency/resources" routerLinkActive="active">
              <i class="fas fa-tools"></i>
              <span>Resources</span>
            </a>
            <a routerLink="/emergency/logs" routerLinkActive="active">
              <i class="fas fa-clipboard-list"></i>
              <span>Incident Logs</span>
            </a>
          </div>
        </div>

        <!-- Air Quality Section -->
        <div class="nav-section">
          <a class="nav-item" (click)="toggleAirQuality()" [class.expanded]="airQualityExpanded">
            <i class="fas fa-wind"></i>
            <span>Air Quality</span>
            <i class="fas fa-chevron-down chevron" [class.rotated]="airQualityExpanded"></i>
          </a>
          <div class="submenu" [class.open]="airQualityExpanded">
            <a routerLink="/air-quality/dashboard" routerLinkActive="active">
              <i class="fas fa-th-large"></i>
              <span>Dashboard</span>
            </a>
          </div>
        </div>

        <!-- Data Section -->
        <div class="nav-section">
          <a class="nav-item" (click)="toggleData()" [class.expanded]="dataExpanded">
            <i class="fas fa-database"></i>
            <span>Data</span>
            <i class="fas fa-chevron-down chevron" [class.rotated]="dataExpanded"></i>
          </a>
          <div class="submenu" [class.open]="dataExpanded">
            <a routerLink="/data/dashboard" routerLinkActive="active">
              <i class="fas fa-th-large"></i>
              <span>Dashboard</span>
            </a>
          </div>
        </div>
      </nav>
    </aside>
  `,
  styles: [`
    .nav-section {
      margin-bottom: 4px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 20px;
      color: var(--gray-700);
      font-weight: 500;
      transition: all 150ms ease;
      border-left: 3px solid transparent;
      cursor: pointer;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.4);
      color: var(--gray-900);
    }

    .nav-item.expanded {
      background: rgba(255, 255, 255, 0.3);
      color: var(--gray-900);
    }

    .nav-item i:first-child {
      width: 20px;
      text-align: center;
      font-size: 16px;
    }

    .nav-item span {
      flex: 1;
    }

    .chevron {
      font-size: 12px;
      transition: transform 200ms ease;
    }

    .chevron.rotated {
      transform: rotate(180deg);
    }

    .submenu {
      max-height: 0;
      overflow: hidden;
      transition: max-height 300ms ease;
      background: rgba(255, 255, 255, 0.2);
    }

    .submenu.open {
      max-height: 300px;
    }

    .submenu a {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 20px 10px 52px;
      color: var(--gray-600);
      font-weight: 400;
      font-size: 13px;
      transition: all 150ms ease;
      border-left: 3px solid transparent;
    }

    .submenu a:hover {
      background: rgba(255, 255, 255, 0.4);
      color: var(--gray-800);
    }

    .submenu a.active {
      background: rgba(255, 255, 255, 0.5);
      color: var(--gray-900);
      border-left-color: var(--gray-800);
      font-weight: 500;
    }

    .submenu a i {
      width: 16px;
      text-align: center;
      font-size: 12px;
    }
  `]
})
export class SidebarComponent {
  mobilityExpanded = true;
  emergencyExpanded = false;
  airQualityExpanded = false;
  dataExpanded = false;

  toggleMobility() {
    this.mobilityExpanded = !this.mobilityExpanded;
  }

  toggleEmergency() {
    this.emergencyExpanded = !this.emergencyExpanded;
  }

  toggleAirQuality() {
    this.airQualityExpanded = !this.airQualityExpanded;
  }

  toggleData() {
    this.dataExpanded = !this.dataExpanded;
  }
}
