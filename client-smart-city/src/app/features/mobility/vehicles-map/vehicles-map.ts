import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Card } from '../../../shared/ui/card/card';
import { Map, MapMarker } from '../../../shared/ui/map/map';
import { Button } from '../../../shared/ui/button/button';
import { MobilityApiService, Vehicle } from '../../../core/services/mobility-api.service';

@Component({
  selector: 'app-vehicles-map',
  standalone: true,
  imports: [CommonModule, Card, Map, Button],
  templateUrl: './vehicles-map.html',
  styleUrl: './vehicles-map.scss',
})
export class VehiclesMap implements OnInit {
  loading = signal(false);
  mapMarkers = signal<MapMarker[]>([]);
  
  constructor(
    private mobilityService: MobilityApiService,
    private router: Router
  ) {}
  
  ngOnInit() {
    this.loadVehicles();
  }
  
  loadVehicles() {
    this.loading.set(true);
    this.mobilityService.getAllVehicles().subscribe(vehicles => {
      this.mapMarkers.set(vehicles.map(v => this.vehicleToMarker(v)));
      this.loading.set(false);
    });
  }
  
  vehicleToMarker(vehicle: Vehicle): MapMarker {
    const colors = {
      running: '#28B463',
      stopped: '#F39C12',
      maintenance: '#95A5A6'
    };
    
    return {
      position: vehicle.location,
      title: `${vehicle.id} (${vehicle.speed} km/h)`,
      color: colors[vehicle.status]
    };
  }
  
  goBack() {
    this.router.navigate(['/mobility']);
  }
}
