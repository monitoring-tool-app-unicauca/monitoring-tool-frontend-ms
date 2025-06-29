import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class TokenExpiredInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const excludedUrls = [
      '/health-check/by-health' 
    ];
    const shouldSkip = excludedUrls.some(url => req.url.includes(url));

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if ((error.status === 401 || error.status === 403)&& !shouldSkip ){
          this.authService.logout();
          this.router.navigate(['/auth/login'], {
            queryParams: { sessionExpired: true }
          });
        }
        return throwError(() => error);
      })
    );
  }
}
