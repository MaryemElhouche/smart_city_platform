import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { ToastComponent } from './components/toast/toast.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent, ToastComponent],
  template: `
    @if (isLoginPage) {
      <router-outlet></router-outlet>
      <app-toast></app-toast>
    } @else {
      <div class="app-container">
        <app-sidebar></app-sidebar>
        <div class="main-content">
          <app-header></app-header>
          <div class="page-content">
            <router-outlet></router-outlet>
          </div>
        </div>
        <app-toast></app-toast>
      </div>
    }
  `
})
export class AppComponent implements OnInit {
  title = 'Smart City Platform';
  isLoginPage = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isLoginPage = event.url === '/login' || event.urlAfterRedirects === '/login';
    });

    // Check initial route
    this.isLoginPage = this.router.url === '/login';
  }
}
