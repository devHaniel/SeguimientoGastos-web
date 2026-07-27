import { HttpInterceptorFn } from '@angular/common/http';
import { config } from '../config';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const reqIsRelative = !req.url.startsWith('http');

  if (reqIsRelative) {
    const cloned = req.clone({ url: `${config.apiUrl}${req.url}` });
    return next(cloned);
  }

  return next(req);
};
