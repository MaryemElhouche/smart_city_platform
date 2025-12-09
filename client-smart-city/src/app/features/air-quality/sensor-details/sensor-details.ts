import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from '../../../shared/ui/card/card';
import { Button } from '../../../shared/ui/button/button';
import { LineChart } from '../../../shared/ui/line-chart/line-chart';
import { AirQualityService } from '../../../core/services/air-quality.service';
import { Sensor, Measurement } from '../../../core/models/air-quality.model';
import { ToastService } from '../../../core/services/toast.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-sensor-details',
  standalone: true,
  imports: [CommonModule, Card, Button, LineChart],
  templateUrl: './sensor-details.html',
  styleUrl: './sensor-details.scss',
})

export class SensorDetails implements OnInit {
  sensor = signal<Sensor | undefined>(undefined);
  measurements = signal<Measurement[]>([]);
  chartData = signal<{ label: string; value: number }[]>([]);
  loadingHistory = signal(true);
  
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly airQualityService: AirQualityService,
    private readonly toast: ToastService
  ) {}
  
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSensorDetails(id);
    }
  }
  
  loadSensorDetails(id: string) {
    this.loadingHistory.set(true);
    
    forkJoin({
      sensors: this.airQualityService.getSensors(),
      measurements: this.airQualityService.getMeasurementsBySensor(id)
    }).subscribe({
      next: ({ sensors, measurements }) => {
        const sensor = sensors.find(s => s.id === id);
        this.sensor.set(sensor);
        this.measurements.set(measurements);
        
        // Create chart data from measurements
        this.chartData.set(
          measurements.slice(-24).map(m => ({
            label: new Date(m.measurementTime).getHours() + 'h',
            value: m.aqi
          }))
        );
        this.loadingHistory.set(false);
      },
      error: () => {
        this.loadingHistory.set(false);
        this.toast.error('Failed to load sensor details');
      }
    });
  }
  
  getAQIColor(aqi: number): string {
    if (aqi <= 50) return '#28B463';
    if (aqi <= 100) return '#F39C12';
    if (aqi <= 150) return '#E67E22';
    return '#E74C3C';
  }
  
  getStatusFromAQI(aqi: number): string {
    if (aqi <= 50) return 'good';
    if (aqi <= 100) return 'moderate';
    return 'unhealthy';
  }
  
  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }
  
  formatTime(date: string): string {
    return new Date(date).toLocaleTimeString();
  }
  
  goBack() {
    this.router.navigate(['/air-quality']);
  }
  
  exportCSV() {
    const csv = this.generateCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = globalThis.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sensor-${this.sensor()?.id}-measurements.csv`;
    a.click();
    this.toast.success('CSV exported successfully');
  }
  
  generateCSV(): string {
    let csv = 'Timestamp,AQI,PM2.5,PM10,CO2,NO2,O3,Temperature,Humidity\\n';
    for (const m of this.measurements()) {
      csv += `${m.measurementTime},${m.aqi},${m.pm25},${m.pm10},${m.co2},${m.no2},${m.o3},${m.temperature},${m.humidity}\\n`;
    }
    return csv;
  }
}
