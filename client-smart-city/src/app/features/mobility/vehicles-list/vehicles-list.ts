import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Card} from '../../../shared/ui/card/card';
import { Table, TableColumn } from '../../../shared/ui/table/table';
import { Button } from '../../../shared/ui/button/button';
import { MobilityService } from '../../../core/services/mobility.service';
import { Vehicle } from '../../../core/models/mobility.model';

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
    { key: 'id', label: 'ID', sortable: true, type: 'number' },
    { key: 'registrationNumber', label: 'Registration', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'capacity', label: 'Capacity', sortable: true, type: 'number' },
    { key: 'currentOccupancy', label: 'Occupancy', sortable: true, type: 'number' },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'lastMaintenance', label: 'Last Maintenance', type: 'date' }
  ];
  
  statusFilters = [
    { value: 'all' as const, label: 'All', icon: 'list', count: signal(0) },
    { value: 'ACTIVE' as const, label: 'Active', icon: 'play_arrow', count: signal(0) },
    { value: 'OUT_OF_SERVICE' as const, label: 'Out of Service', icon: 'stop', count: signal(0) },
    { value: 'MAINTENANCE' as const, label: 'Maintenance', icon: 'build', count: signal(0) }
  ];
  
  constructor(private mobilityService: MobilityService) {}
  
  ngOnInit() {
    this.loadVehicles();
  }
  
  loadVehicles() {
    this.loading.set(true);
    this.mobilityService.getVehicles().subscribe(vehicles => {
      this.vehicles.set(vehicles);
      this.updateCounts();
      this.loading.set(false);
    });
  }
  
  updateCounts() {
    const vehicles = this.vehicles();
    this.statusFilters[0].count.set(vehicles.length);
    this.statusFilters[1].count.set(vehicles.filter(v => v.status === 'ACTIVE').length);
    this.statusFilters[2].count.set(vehicles.filter(v => v.status === 'OUT_OF_SERVICE').length);
    this.statusFilters[3].count.set(vehicles.filter(v => v.status === 'MAINTENANCE').length);
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