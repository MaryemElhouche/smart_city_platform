import { Component, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MapMarker {
  position: [number, number];
  title: string;
  color?: string;
  icon?: string;
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class Map implements AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  @Input() markers: MapMarker[] = [];
  @Input() center: [number, number] = [36.8065, 10.1815]; // Tunis
  
  width = 800;
  height = 400;
  zoom = 1;
  gridLines = Array.from({ length: 20 }, (_, i) => i);
  
  ngAfterViewInit() {
    if (this.mapContainer?.nativeElement?.offsetWidth) {
      this.width = this.mapContainer.nativeElement.offsetWidth || 800;
      this.height = this.mapContainer.nativeElement.offsetHeight || 400;
    }
  }
  
  get viewBox() {
    return `0 0 ${this.width} ${this.height}`;
  }

  get zoomedViewBox(): string {
    const viewWidth = this.width / this.zoom;
    const viewHeight = this.height / this.zoom;
    const offsetX = (this.width - viewWidth) / 2;
    const offsetY = (this.height - viewHeight) / 2;
    return `${offsetX} ${offsetY} ${viewWidth} ${viewHeight}`;
  }
  
  getX(lng: number): number {
    // Simple mercator projection
    const minLng = this.center[1] - 0.05;
    const maxLng = this.center[1] + 0.05;
    return ((lng - minLng) / (maxLng - minLng)) * this.width;
  }
  
  getY(lat: number): number {
    const minLat = this.center[0] - 0.05;
    const maxLat = this.center[0] + 0.05;
    return this.height - ((lat - minLat) / (maxLat - minLat)) * this.height;
  }
  
  zoomIn() {
    this.zoom = Math.min(this.zoom * 1.2, 3);
  }
  
  zoomOut() {
    this.zoom = Math.max(this.zoom / 1.2, 0.5);
  }
  
  onMarkerClick(marker: MapMarker) {
    console.log('Marker clicked:', marker);
  }

}
