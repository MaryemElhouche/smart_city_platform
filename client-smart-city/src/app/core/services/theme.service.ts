import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal(false);
  
  constructor() {
    if (globalThis.window && globalThis.localStorage) {
      const savedTheme = globalThis.localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        this.enableDarkMode();
      }
    }
  }
  
  toggleTheme() {
    if (this.isDarkMode()) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }
  
  private enableDarkMode() {
    if (globalThis.window) {
      document.documentElement.dataset['theme'] = 'dark';
    }
    if (globalThis.localStorage) {
      globalThis.localStorage.setItem('theme', 'dark');
    }
    this.isDarkMode.set(true);
  }
  
  private disableDarkMode() {
    if (globalThis.window) {
      delete document.documentElement.dataset['theme'];
    }
    if (globalThis.localStorage) {
      globalThis.localStorage.setItem('theme', 'light');
    }
    this.isDarkMode.set(false);
  }
}