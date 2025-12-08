import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Card } from '../../shared/ui/card/card';
import { LineChart } from '../../shared/ui/line-chart/line-chart';
import { Map, MapMarker } from '../../shared/ui/map/map';
import { AirQualityApiService } from '../../core/services/air-quality-api.service';
import { MobilityApiService } from '../../core/services/mobility-api.service';
import { GraphqlApiService } from '../../core/services/graphql-api.service';
import { EmergencyApiService } from '../../core/services/emergency-api.service';

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
    private readonly airQualityService: AirQualityApiService,
    private readonly mobilityService: MobilityApiService,
    private readonly graphqlService: GraphqlApiService,
    private readonly emergencyService: EmergencyApiService
  ) {}
  
  ngOnInit() {
    this.loadDashboardData();
    this.setupAutoRefresh();
  }
  
  loadDashboardData() {
    this.loading.set(true);
    
    // Load air quality data
    this.airQualityService.getAllSensors().subscribe(sensors => {
      const alertCount = sensors.filter(s => s.alert).length;
      this.airQualityStatus.set(alertCount > 0 ? `${alertCount} Alerts` : 'All Good');
      
      // Add sensors to map
      const sensorMarkers: MapMarker[] = sensors.map(s => ({
        position: s.coordinates,
        title: s.zone,
        color: s.alert ? '#E74C3C' : '#28B463'
      }));
      
      this.mapMarkers.update(markers => [...markers, ...sensorMarkers]);
      
      // Load AQI history for chart
      if (sensors.length > 0) {
        this.airQualityService.getSensorHistory(sensors[0].id).subscribe(history => {
          this.aqiChartData.set(
            history.map(h => ({
              label: new Date(h.timestamp).getHours() + 'h',
              value: h.value
            }))
          );
        });
      }
    });
    
    // Load mobility data
    this.mobilityService.getOnlineCount().subscribe(count => {
      this.vehiclesOnline.set(count);
    });
    
    this.mobilityService.getAllVehicles().subscribe(vehicles => {
      const vehicleMarkers: MapMarker[] = vehicles.map(v => ({
        position: v.location,
        title: v.id,
        color: '#21618C',
        icon: 'directions_bus'
      }));
      
      this.mapMarkers.update(markers => [...markers, ...vehicleMarkers]);
    });
    
    // Load emergency data
    this.emergencyService.getActiveCount().subscribe(count => {
      this.activeEmergencies.set(count);
    });
    
    // Load GraphQL query count
    this.graphqlService.getQueryCount().subscribe(count => {
      this.queryCount.set(count);
    });
    
    setTimeout(() => this.loading.set(false), 1000);
  }
  
  setupAutoRefresh() {
    // Simulate WebSocket updates every 5 seconds
    setInterval(() => {
      this.vehiclesOnline.update(v => v + Math.floor(Math.random() * 3 - 1));
    }, 5000);
  }

}
