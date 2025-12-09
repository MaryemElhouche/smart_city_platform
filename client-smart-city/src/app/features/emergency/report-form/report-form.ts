import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Card } from '../../../shared/ui/card/card';
import { Button } from '../../../shared/ui/button/button';
import { EmergencyService } from '../../../core/services/emergency.service';
import { EmergencyEvent } from '../../../core/models/emergency.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-report-form',
  standalone: true,
  imports: [CommonModule, FormsModule, Card, Button],
  templateUrl: './report-form.html',
  styleUrl: './report-form.scss',
})

export class ReportForm {
  report: Partial<EmergencyEvent> = {
    title: '',
    description: '',
    severity: 'MEDIUM',
    status: 'REPORTED'
  };
  
  submitting = signal(false);
  
  severityLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  
  constructor(
    private emergencyService: EmergencyService,
    private toast: ToastService,
    private router: Router
  ) {}
  
  submitReport() {
    this.submitting.set(true);
    
    this.emergencyService.createEvent(this.report as Omit<EmergencyEvent, 'id'>).subscribe({
      next: () => {
        this.toast.success('Emergency report submitted successfully');
        this.submitting.set(false);
        this.router.navigate(['/emergency']);
      },
      error: () => {
        this.toast.error('Failed to submit report');
        this.submitting.set(false);
      }
    });
  }
  
  cancel() {
    this.router.navigate(['/emergency/timeline']);
  }
}
