import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Add Basic Auth for gateway requests
  if (req.url.startsWith(environment.apiUrl)) {
    const credentials = btoa(`${environment.gatewayAuth.username}:${environment.gatewayAuth.password}`);
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Basic ${credentials}`)
    });
    return next(cloned);
  }

  // Legacy token-based auth
  const token = localStorage.getItem('auth_token');
  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  }
  
  return next(req);
};