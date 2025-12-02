import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthApi } from './api/auth-api';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authApi = inject(AuthApi);
  const token = authApi.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
