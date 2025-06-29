import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth/auth.service';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { UserDto } from '../interfaces/userDTO';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user:UserDto = this.authService.getCurrentUser();

    if (user.isAdmin) {
      return true;
    }

    this.router.navigate(['/monitoring']);
    return false;
  }
}
