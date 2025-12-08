import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'badge' | 'date' | 'number' | 'boolean';
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() actions = false;
  @Input() clickable = false;
  @Input() loading = false;
  @Input() showFooter = true;
  @Input() emptyMessage = 'No data available';
  
  @Output() rowClick = new EventEmitter<any>();
  @Output() sort = new EventEmitter<{ key: string; desc: boolean }>();
  
  sortKey = '';
  sortDesc = false;
  
  onSort(key: string) {
    if (this.sortKey === key) {
      this.sortDesc = !this.sortDesc;
    } else {
      this.sortKey = key;
      this.sortDesc = false;
    }
    this.sort.emit({ key, desc: this.sortDesc });
  }
  
  onRowClick(row: any) {
    if (this.clickable) {
      this.rowClick.emit(row);
    }
  }
  
  sortedData(): any[] {
    if (!this.sortKey) return this.data;
    
    return [...this.data].sort((a, b) => {
      const aVal = a[this.sortKey];
      const bVal = b[this.sortKey];
      
      let comparison = 0;
      if (aVal > bVal) comparison = 1;
      if (aVal < bVal) comparison = -1;
      
      return this.sortDesc ? -comparison : comparison;
    });
  }
  
  getBadgeClass(value: any): string {
    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }
    return String(value).toLowerCase().replace(/\s+/g, '-');
  }
  
  formatBadgeValue(value: any): string {
    if (typeof value === 'boolean') {
      return value ? 'Alert' : 'OK';
    }
    return String(value);
  }
  
  formatDate(date: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleString();
  }
  
  formatNumber(num: any): string {
    if (num === null || num === undefined) return '-';
    return Number(num).toLocaleString();
  }
}