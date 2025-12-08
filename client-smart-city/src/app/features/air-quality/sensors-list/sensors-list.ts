import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Card } from '../../../shared/ui/card/card';
import { Table, TableColumn } from '../../../shared/ui/table/table';
import { Button } from '../../../shared/ui/button/button';
import { Map, MapMarker } from '../../../shared/ui/map/map';
import { AirQualityApiService, AirQualitySensor } from '../../../core/services/air-quality-api.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-sensors-list',
  standalone: true,
  imports: [
    CommonModule,
    Card,
    Table,
    Button,
    Map
  ],
  templateUrl: './sensors-list.html',
  styleUrl: './sensors-list.scss',
})
export class SensorsList implements OnInit {
  loading = signal(false);
  sensors = signal<AirQualitySensor[]>([]);
  viewMode = signal<'table' | 'map'>('table');
  goodSensors = signal(0);
  alertSensors = signal(0);
  
  columns: TableColumn[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'zone', label: 'Zone', sortable: true },
    { key: 'currentAQI', label: 'Current AQI', sortable: true, type: 'number' },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'alert', label: 'Alert', type: 'badge' },
    { key: 'lastUpdate', label: 'Last Update', sortable: true, type: 'date' }
  ];
  
  mapMarkers = signal<MapMarker[]>([]);
  
  constructor(
    private readonly airQualityService: AirQualityApiService,
    private readonly router: Router,
    private readonly toast: ToastService
  ) {}
  
  ngOnInit() {
    this.loadSensors();
  }
  
  loadSensors() {
    this.loading.set(true);
    this.airQualityService.getAllSensors().subscribe({
      next: (sensors) => {
        this.sensors.set(sensors);
        this.goodSensors.set(sensors.filter(s => !s.alert).length);
        this.alertSensors.set(sensors.filter(s => s.alert).length);
        
        // Update map markers
        this.mapMarkers.set(sensors.map(s => ({
          position: s.coordinates,
          title: `${s.zone} (AQI: ${s.currentAQI})`,
          color: s.alert ? '#E74C3C' : '#28B463'
        })));
        
        this.loading.set(false);
        this.toast.success('Sensors data refreshed');
      },
      error: () => {
        this.loading.set(false);
        this.toast.error('Failed to load sensors');
      }
    });
  }
  
  viewDetails(sensor: AirQualitySensor) {
    this.router.navigate(['/air-quality/sensor', sensor.id]);
  }
  
  toggleView() {
    this.viewMode.update(mode => mode === 'table' ? 'map' : 'table');
  }
}