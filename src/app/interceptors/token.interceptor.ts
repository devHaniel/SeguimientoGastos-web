import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, catchError, switchMap, throwError } from 'rxjs';
import { Auth } from '../services/auth';

let isRefreshing = false;
let refreshSubj: Subject<void> | null = null;

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(Auth);
  const token = localStorage.getItem('token');
  const isAuthUrl = req.url.includes('/auth/');

  let clonedReq = req;
  if (token && !req.url.includes('/auth/refresh')) {
    clonedReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(clonedReq).pipe(
    catchError((err) => {
      if (err.status === 401 && !isAuthUrl) {
        const refreshToken = localStorage.getItem('refresh_token');

        if (refreshToken && !isRefreshing) {
          isRefreshing = true;
          refreshSubj = new Subject<void>();

          auth.refreshToken(refreshToken).subscribe({
            next: (res) => {
              isRefreshing = false;
              localStorage.setItem('token', res.token);
              localStorage.setItem('refresh_token', res.refresh_token);
              refreshSubj!.next();
              refreshSubj!.complete();
              refreshSubj = null;
            },
            error: () => {
              isRefreshing = false;
              refreshSubj!.complete();
              refreshSubj = null;
              localStorage.clear();
              router.navigate(['/login']);
            },
          });
        }

        if (refreshSubj) {
          return refreshSubj.pipe(
            switchMap(() => {
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${localStorage.getItem('token')}` },
              });
              return next(retryReq);
            }),
          );
        }
      }

      if (err.status === 401) {
        localStorage.clear();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    }),
  );
};
