import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth/auth.service';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return of(true)
    const userEmail = localStorage.getItem('userEmail');
    console.log("User email ",userEmail)
    if (!userEmail) {
      /* this.router.navigate(['/auth/login']); */
      return new Observable<boolean>(observer => {
        observer.next(false);
        observer.complete();
      });
    }

    //return this.authService.isAdmin(userEmail).pipe(
    //  tap(isAdmin => {
    //    if (!isAdmin) {
          /* this.router.navigate(['/auth/login']); */
    //    }
    //  })
    //);
  }
}
