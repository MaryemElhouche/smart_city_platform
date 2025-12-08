import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

// Add toast container to body
const toastContainer = document.createElement('app-toast');
document.body.appendChild(toastContainer);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));