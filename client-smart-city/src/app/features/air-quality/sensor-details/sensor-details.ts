import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from '../../../shared/ui/card/card';
import { Button } from '../../../shared/ui/button/button';
import { LineChart } from '../../../shared/ui/line-chart/line-chart';
import { AirQualityApiService, AirQualitySensor, AQIHistory } from '../../../core/services/air-quality-api.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-sensor-details',
  standalone: true,
  imports: [CommonModule, Card, Button, LineChart],
  templateUrl: './sensor-details.html',
  styleUrl: './sensor-details.scss',
})

export class SensorDetails implements OnInit {
  sensor = signal<AirQualitySensor | undefined>(undefined);
  history = signal<AQIHistory[]>([]);
  chartData = signal<{ label: string; value: number }[]>([]);
  loadingHistory = signal(true);
  
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly airQualityService: AirQualityApiService,
    private readonly toast: ToastService
  ) {}
  
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSensorDetails(id);
    }
  }
  
  loadSensorDetails(id: string) {
    this.airQualityService.getSensorById(id).subscribe(sensor => {
      this.sensor.set(sensor);
    });
    
    this.airQualityService.getSensorHistory(id).subscribe(history => {
      this.history.set(history);
      this.chartData.set(
        history.map(h => ({
          label: new Date(h.timestamp).getHours() + 'h',
          value: h.value
        }))
      );
      this.loadingHistory.set(false);
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
    a.download = `sensor-${this.sensor()?.id}-history.csv`;
    a.click();
    this.toast.success('CSV exported successfully');
  }
  
  generateCSV(): string {
    let csv = 'Timestamp,AQI Value,Status\n';
    for (const item of this.history()) {
      csv += `${item.timestamp},${item.value},${this.getStatusFromAQI(item.value)}\n`;
    }
    return csv;
  }
}
