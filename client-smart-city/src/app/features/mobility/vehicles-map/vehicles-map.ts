import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Card } from '../../../shared/ui/card/card';
import { Map, MapMarker } from '../../../shared/ui/map/map';
import { Button } from '../../../shared/ui/button/button';
import { MobilityService } from '../../../core/services/mobility.service';
import { Vehicle, Station } from '../../../core/models/mobility.model';
import { forkJoin } from 'rxjs';

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
    private mobilityService: MobilityService,
    private router: Router
  ) {}
  
  ngOnInit() {
    this.loadData();
  }
  
  loadData() {
    this.loading.set(true);
    
    forkJoin({
      vehicles: this.mobilityService.getVehicles(),
      stations: this.mobilityService.getStations()
    }).subscribe({
      next: ({ vehicles, stations }) => {
        const markers: MapMarker[] = [
          ...stations.map(s => this.stationToMarker(s)),
          // Vehicles don't have location in the model, so we skip them
          // If you add location to Vehicle model, uncomment:
          // ...vehicles.map(v => this.vehicleToMarker(v))
        ];
        this.mapMarkers.set(markers);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
  
  stationToMarker(station: Station): MapMarker {
    return {
      position: [station.latitude, station.longitude],
      title: station.name,
      color: '#21618C',
      icon: 'directions_bus'
    };
  }
  
  goBack() {
    this.router.navigate(['/mobility']);
  }
}
