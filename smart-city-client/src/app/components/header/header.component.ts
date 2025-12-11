import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="header-left">
        <div class="header-title">
          <h2>{{ pageTitle }}</h2>
          <p>{{ pageSubtitle }}</p>
        </div>
      </div>
      <div class="header-right">
        <div class="header-actions">
          <button class="icon-btn" title="Notifications">
            <i class="fas fa-bell"></i>
            <span class="badge">3</span>
          </button>
          <button class="icon-btn" title="Settings">
            <i class="fas fa-cog"></i>
          </button>
          <div class="user-menu" (click)="toggleUserMenu()">
            <div class="user-avatar">{{ userInitials }}</div>
            <span class="user-name">{{ userName }}</span>
            <i class="fas fa-chevron-down"></i>
          </div>
          @if (showUserMenu) {
            <div class="user-dropdown">
              <div class="dropdown-header">
                <div class="user-avatar large">{{ userInitials }}</div>
                <div class="user-info">
                  <span class="name">{{ userName }}</span>
                  <span class="role">{{ userRole }}</span>
                </div>
              </div>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item" (click)="logout()">
                <i class="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </div>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    .user-menu {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 8px;
      transition: background 0.2s;
      position: relative;
    }
    .user-menu:hover { background: var(--gray-100); }
    .user-name { font-weight: 500; color: var(--gray-700); }
    .user-menu i { font-size: 12px; color: var(--gray-400); }
    
    .user-avatar.large {
      width: 48px;
      height: 48px;
      font-size: 18px;
    }
    
    .user-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
      min-width: 220px;
      z-index: 1000;
      overflow: hidden;
      animation: slideDown 0.2s ease;
    }
    
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .dropdown-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .dropdown-header .user-avatar {
      background: rgba(255,255,255,0.2);
      color: white;
    }
    
    .user-info { display: flex; flex-direction: column; }
    .user-info .name { font-weight: 600; font-size: 15px; }
    .user-info .role { font-size: 12px; opacity: 0.9; }
    
    .dropdown-divider {
      height: 1px;
      background: var(--gray-100);
    }
    
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 12px 16px;
      font-size: 14px;
      color: var(--gray-700);
      transition: background 0.2s;
    }
    
    .dropdown-item:hover {
      background: var(--gray-50);
    }
    
    .dropdown-item i {
      width: 20px;
      color: var(--gray-400);
    }
  `]
})
export class HeaderComponent {
  pageTitle = 'Dashboard';
  pageSubtitle = 'Welcome to Smart City Platform';
  showUserMenu = false;
  userName = '';
  userInitials = '';
  userRole = '';

  private pageTitles: { [key: string]: { title: string; subtitle: string } } = {
    '/dashboard': { title: 'Dashboard', subtitle: 'Welcome to Smart City Platform' },
    '/mobility/dashboard': { title: 'Mobility Dashboard', subtitle: 'Transportation overview' },
    '/mobility/transports': { title: 'Transports', subtitle: 'Manage city transportation' },
    '/mobility/lines': { title: 'Transport Lines', subtitle: 'Manage routes and schedules' },
    '/mobility/stations': { title: 'Stations', subtitle: 'Manage stop locations' },
    '/mobility/vehicles': { title: 'Vehicle Fleet', subtitle: 'Manage vehicles' },
    '/emergency/dashboard': { title: 'Emergency Dashboard', subtitle: 'Emergency services overview' },
    '/emergency/events': { title: 'Emergency Events', subtitle: 'Active emergency incidents' },
    '/emergency/units': { title: 'Response Units', subtitle: 'Emergency response teams' },
    '/emergency/resources': { title: 'Resources', subtitle: 'Emergency equipment and supplies' },
    '/emergency/logs': { title: 'Activity Logs', subtitle: 'Emergency response history' },
    '/air-quality/dashboard': { title: 'Air Quality Dashboard', subtitle: 'Environmental monitoring' },
    '/air-quality/zones': { title: 'Monitoring Zones', subtitle: 'Air quality zones' },
    '/air-quality/sensors': { title: 'Sensors', subtitle: 'Air quality sensors' },
    '/air-quality/measurements': { title: 'Measurements', subtitle: 'Air quality data' },
    '/air-quality/alerts': { title: 'Alerts', subtitle: 'Air quality alerts' },
    '/data/dashboard': { title: 'Data Dashboard', subtitle: 'City data analytics' },
    '/data/city-overview': { title: 'City Overview', subtitle: 'Comprehensive city view' },
    '/data/travel': { title: 'Travel Suggestions', subtitle: 'Smart travel recommendations' },
    '/data/incidents': { title: 'Incidents', subtitle: 'City incident reports' },
    '/data/explorer': { title: 'GraphQL Explorer', subtitle: 'Query city data' }
  };

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => (event as NavigationEnd).url)
    ).subscribe(url => {
      const config = this.pageTitles[url] || { title: 'Dashboard', subtitle: 'Smart City Platform' };
      this.pageTitle = config.title;
      this.pageSubtitle = config.subtitle;
    });
    
    // Get user info
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.username;
      this.userInitials = user.username.substring(0, 2).toUpperCase();
      this.userRole = user.roles.includes('ADMIN') ? 'Administrator' : 'User';
    }
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
