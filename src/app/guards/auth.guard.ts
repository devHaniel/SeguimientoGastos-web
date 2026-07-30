import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

let ultimaVerificacion = 0;
const CACHE_MS = 30000;

export const authGuard: CanActivateChildFn = () => {
  const router = inject(Router);
  const auth = inject(Auth);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const ahora = Date.now();
  if (ahora - ultimaVerificacion < CACHE_MS) {
    return true;
  }

  ultimaVerificacion = ahora;

  return auth.verificarToken(token).pipe(
    map((res) => {
      if (res.expirado) {
        auth.limpiarSesion();
        return false;
      }
      return true;
    }),
    catchError(() => {
      return of(true);
    }),
  );
};
