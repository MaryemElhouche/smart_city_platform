import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


interface MenuItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  menuItems: MenuItem[] = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'air', label: 'Air Quality', route: '/air-quality' },
    { icon: 'directions_bus', label: 'Mobility', route: '/mobility' },
    { icon: 'storage', label: 'Data Explorer', route: '/data-explorer' },
    { icon: 'emergency', label: 'Emergency', route: '/emergency' }
  ];
}
