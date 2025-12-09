import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Card } from '../../../shared/ui/card/card';
import { Button } from '../../../shared/ui/button/button';
import { EmergencyService } from '../../../core/services/emergency.service';
import { EmergencyEvent } from '../../../core/models/emergency.model';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, RouterModule, Card, Button],
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
})

export class Timeline implements OnInit {
  loading = signal(false);
  emergencies = signal<EmergencyEvent[]>([]);
  reportedCount = signal(0);
  inProgressCount = signal(0);
  resolvedCount = signal(0);
  
  constructor(private emergencyService: EmergencyService) {}
  
  ngOnInit() {
    this.loadEmergencies();
  }
  
  loadEmergencies() {
    this.loading.set(true);
    this.emergencyService.getEvents().subscribe(emergencies => {
      this.emergencies.set(emergencies);
      this.updateCounts();
      this.loading.set(false);
    });
  }
  
  updateCounts() {
    const emergencies = this.emergencies();
    this.reportedCount.set(emergencies.filter(e => e.status === 'REPORTED').length);
    this.inProgressCount.set(emergencies.filter(e => e.status === 'IN_PROGRESS').length);
    this.resolvedCount.set(emergencies.filter(e => e.status === 'RESOLVED').length);
  }
  
  getSeverityIcon(severity: string): string {
    const icons: Record<string, string> = {
      'LOW': 'info',
      'MEDIUM': 'warning',
      'HIGH': 'error',
      'CRITICAL': 'local_fire_department'
    };
    return icons[severity] || 'report_problem';
  }
  
  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    
    if (hours < 1) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
}