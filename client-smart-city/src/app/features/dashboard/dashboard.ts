import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Card } from '../../shared/ui/card/card';
import { LineChart } from '../../shared/ui/line-chart/line-chart';
import { Map, MapMarker } from '../../shared/ui/map/map';
import { AirQualityService } from '../../core/services/air-quality.service';
import { MobilityService } from '../../core/services/mobility.service';
import { GraphQLService } from '../../core/services/graphql.service';
import { EmergencyService } from '../../core/services/emergency.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Card,
    LineChart,
    Map
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  loading = signal(true);
  airQualityStatus = signal('Loading...');
  vehiclesOnline = signal(0);
  activeEmergencies = signal(0);
  queryCount = signal(0);
  mapMarkers = signal<MapMarker[]>([]);
  aqiChartData = signal<{ label: string; value: number }[]>([]);
  
  constructor(
    private readonly airQualityService: AirQualityService,
    private readonly mobilityService: MobilityService,
    private readonly graphqlService: GraphQLService,
    private readonly emergencyService: EmergencyService
  ) {}
  
  ngOnInit() {
    this.loadDashboardData();
    this.setupAutoRefresh();
  }
  
  loadDashboardData() {
    this.loading.set(true);
    
    forkJoin({
      sensors: this.airQualityService.getSensors(),
      alerts: this.airQualityService.getActiveAlerts(),
      vehicles: this.mobilityService.getVehicles(),
      stations: this.mobilityService.getStations(),
      emergencyUnits: this.emergencyService.getUnits(),
      emergencyEvents: this.emergencyService.getEvents(),
      cityOverview: this.graphqlService.getCityOverview('zone1')
    }).subscribe({
      next: (data) => {
        // Air Quality
        const alertCount = data.alerts.length;
        this.airQualityStatus.set(alertCount > 0 ? `${alertCount} Alerts` : 'All Good');
        
        // Add sensors to map (using [lat, lng] tuple format)
        const sensorMarkers: MapMarker[] = data.sensors
          .filter(s => s.latitude && s.longitude)
          .map(s => ({
            position: [s.latitude, s.longitude],
            title: s.zone,
            color: s.status === 'ACTIVE' ? '#28B463' : '#E74C3C'
          }));
        
        // Add stations to map
        const stationMarkers: MapMarker[] = data.stations.map(s => ({
          position: [s.latitude, s.longitude],
          title: s.name,
          color: '#21618C',
          icon: 'directions_bus'
        }));
        
        this.mapMarkers.set([...sensorMarkers, ...stationMarkers]);
        
        // Set vehicle count
        this.vehiclesOnline.set(data.vehicles.filter(v => v.status === 'ACTIVE').length);
        
        // Set emergency count
        this.activeEmergencies.set(data.emergencyEvents.length);
        
        // Set GraphQL query count (using city overview data)
        this.queryCount.set(data.cityOverview.activeIncidents.length);
        
        // Set AQI chart data from city overview
        if (data.cityOverview) {
          this.aqiChartData.set([
            { label: 'Current AQI', value: data.cityOverview.currentAQI }
          ]);
        }
        
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.loading.set(false);
      }
    });
  }
  
  setupAutoRefresh() {
    // Simulate WebSocket updates every 5 seconds
    setInterval(() => {
      this.vehiclesOnline.update(v => v + Math.floor(Math.random() * 3 - 1));
    }, 5000);
  }

}
