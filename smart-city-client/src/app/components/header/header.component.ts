import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';

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
        <div class="search-box">
          <input type="text" placeholder="Search...">
          <i class="fas fa-search"></i>
        </div>
        <div class="header-actions">
          <button class="icon-btn">
            <i class="fas fa-bell"></i>
            <span class="badge">3</span>
          </button>
          <button class="icon-btn">
            <i class="fas fa-cog"></i>
          </button>
          <div class="user-avatar">SC</div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  pageTitle = 'Dashboard';
  pageSubtitle = 'Welcome to Smart City Mobility';

  private pageTitles: { [key: string]: { title: string; subtitle: string } } = {
    '/dashboard': { title: 'Dashboard', subtitle: 'Welcome to Smart City Mobility' },
    '/transports': { title: 'Transports', subtitle: 'Manage city transportation' },
    '/lines': { title: 'Transport Lines', subtitle: 'Manage routes and schedules' },
    '/stations': { title: 'Stations', subtitle: 'Manage stop locations' },
    '/vehicles': { title: 'Vehicle Fleet', subtitle: 'Manage vehicles' }
  };

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => (event as NavigationEnd).url)
    ).subscribe(url => {
      const config = this.pageTitles[url] || this.pageTitles['/dashboard'];
      this.pageTitle = config.title;
      this.pageSubtitle = config.subtitle;
    });
  }
}
