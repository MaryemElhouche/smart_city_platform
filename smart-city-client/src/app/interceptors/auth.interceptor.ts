import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const username = 'admin';
  const password = 'admin123';
  const credentials = btoa(`${username}:${password}`);
  
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Basic ${credentials}`
    }
  });
  
  return next(authReq);
};
