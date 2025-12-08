import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Card} from '../../../shared/ui/card/card';
import { Table, TableColumn } from '../../../shared/ui/table/table';
import { Button } from '../../../shared/ui/button/button';
import { MobilityApiService, Vehicle } from '../../../core/services/mobility-api.service';

@Component({
  selector: 'app-vehicles-list',
  standalone: true,
  imports: [CommonModule, RouterModule, Card, Table, Button],
  templateUrl: './vehicles-list.html',
  styleUrl: './vehicles-list.scss',
})
export class VehiclesList implements OnInit {
  loading = signal(false);
  vehicles = signal<Vehicle[]>([]);
  selectedFilter = signal<Vehicle['status'] | 'all'>('all');
  
  columns: TableColumn[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'speed', label: 'Speed (km/h)', sortable: true },
    { key: 'route', label: 'Route' },
    { key: 'battery', label: 'Battery %', sortable: true },
    { key: 'lastUpdate', label: 'Last Update', type: 'date' }
  ];
  
  statusFilters = [
    { value: 'all' as const, label: 'All', icon: 'list', count: signal(0) },
    { value: 'running' as const, label: 'Running', icon: 'play_arrow', count: signal(0) },
    { value: 'stopped' as const, label: 'Stopped', icon: 'stop', count: signal(0) },
    { value: 'maintenance' as const, label: 'Maintenance', icon: 'build', count: signal(0) }
  ];
  
  constructor(private mobilityService: MobilityApiService) {}
  
  ngOnInit() {
    this.loadVehicles();
  }
  
  loadVehicles() {
    this.loading.set(true);
    this.mobilityService.getAllVehicles().subscribe(vehicles => {
      this.vehicles.set(vehicles);
      this.updateCounts();
      this.loading.set(false);
    });
  }
  
  updateCounts() {
    const vehicles = this.vehicles();
    this.statusFilters[0].count.set(vehicles.length);
    this.statusFilters[1].count.set(vehicles.filter(v => v.status === 'running').length);
    this.statusFilters[2].count.set(vehicles.filter(v => v.status === 'stopped').length);
    this.statusFilters[3].count.set(vehicles.filter(v => v.status === 'maintenance').length);
  }
  
  setFilter(status: Vehicle['status'] | 'all') {
    this.selectedFilter.set(status);
  }
  
  filteredVehicles() {
    const filter = this.selectedFilter();
    if (filter === 'all') return this.vehicles();
    return this.vehicles().filter(v => v.status === filter);
  }
}