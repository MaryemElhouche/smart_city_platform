import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Card } from '../../../shared/ui/card/card';
import { Table, TableColumn } from '../../../shared/ui/table/table';
import { Button } from '../../../shared/ui/button/button';
import { Map, MapMarker } from '../../../shared/ui/map/map';
import { AirQualityService } from '../../../core/services/air-quality.service';
import { Sensor, Measurement } from '../../../core/models/air-quality.model';
import { ToastService } from '../../../core/services/toast.service';
import { forkJoin } from 'rxjs';

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
  sensors = signal<Sensor[]>([]);
  sensorData = signal<Array<Sensor & { currentAQI?: number, alert?: boolean }>>([]);
  viewMode = signal<'table' | 'map'>('table');
  goodSensors = signal(0);
  alertSensors = signal(0);
  
  columns: TableColumn[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'zone', label: 'Zone', sortable: true },
    { key: 'model', label: 'Model', sortable: true },
    { key: 'manufacturer', label: 'Manufacturer', sortable: true },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'currentAQI', label: 'Current AQI', sortable: true, type: 'number' },
    { key: 'installedAt', label: 'Installed', sortable: true, type: 'date' }
  ];
  
  mapMarkers = signal<MapMarker[]>([]);
  
  constructor(
    private readonly airQualityService: AirQualityService,
    private readonly router: Router,
    private readonly toast: ToastService
  ) {}
  
  ngOnInit() {
    this.loadSensors();
  }
  
  loadSensors() {
    this.loading.set(true);
    
    forkJoin({
      sensors: this.airQualityService.getSensors(),
      alerts: this.airQualityService.getActiveAlerts()
    }).subscribe({
      next: ({ sensors, alerts }) => {
        this.sensors.set(sensors);
        
        // Get latest measurements for each sensor to show AQI
        const sensorsWithData = sensors.map(s => {
          const sensorAlerts = alerts.filter(a => a.zone === s.zone);
          return {
            ...s,
            currentAQI: 0, // Will be updated with real measurement
            alert: sensorAlerts.some(a => a.severity === 'CRITICAL' || a.severity === 'HIGH')
          };
        });
        
        this.sensorData.set(sensorsWithData);
        this.goodSensors.set(sensorsWithData.filter(s => !s.alert).length);
        this.alertSensors.set(sensorsWithData.filter(s => s.alert).length);
        
        // Update map markers using [lat, lng] format
        this.mapMarkers.set(sensors.map(s => ({
          position: [s.latitude, s.longitude],
          title: `${s.zone} (${s.model})`,
          color: s.status === 'ACTIVE' ? '#28B463' : '#E74C3C'
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
  
  viewDetails(sensor: Sensor) {
    this.router.navigate(['/air-quality/sensor', sensor.id]);
  }
  
  toggleView() {
    this.viewMode.update(mode => mode === 'table' ? 'map' : 'table');
  }
}