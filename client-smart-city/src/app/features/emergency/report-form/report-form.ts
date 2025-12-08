import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Card } from '../../../shared/ui/card/card';
import { Button } from '../../../shared/ui/button/button';
import { EmergencyApiService, EmergencyReport } from '../../../core/services/emergency-api.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-report-form',
  standalone: true,
  imports: [CommonModule, FormsModule, Card, Button],
  templateUrl: './report-form.html',
  styleUrl: './report-form.scss',
})

export class ReportForm {
report: EmergencyReport = {
    zone: '',
    type: 'fire',
    description: ''
  };
  
  submitting = signal(false);
  selectedFileName = signal('');
  
  constructor(
    private emergencyService: EmergencyApiService,
    private toast: ToastService,
    private router: Router
  ) {}
  
  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.report.image = file;
      this.selectedFileName.set(file.name);
    }
  }
  
  submitReport() {
    this.submitting.set(true);
    
    this.emergencyService.submitReport(this.report).subscribe({
      next: (response) => {
        this.toast.success('Emergency report submitted successfully');
        this.submitting.set(false);
        this.router.navigate(['/emergency/timeline']);
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
