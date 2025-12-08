import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);
  private idCounter = 0;
  
  show(message: string, type: Toast['type'] = 'info', duration = 3000) {
    const id = this.idCounter++;
    const toast: Toast = { id, message, type };
    
    this.toasts.update(toasts => [...toasts, toast]);
    
    setTimeout(() => {
      this.remove(id);
    }, duration);
  }
  
  success(message: string) {
    this.show(message, 'success');
  }
  
  error(message: string) {
    this.show(message, 'error');
  }
  
  info(message: string) {
    this.show(message, 'info');
  }
  
  warning(message: string) {
    this.show(message, 'warning');
  }
  
  remove(id: number) {
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }
}