import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.API_USERS_URL;

  constructor(private http: HttpClient) {}

  validateEmail(email: string): Observable<{ available: boolean }> {
    return this.http.get<{ available: boolean }>(`${this.apiUrl}/user/by-email?email=${email}`);
  }
  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { name, email, password });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  recoverPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recover-password`, { email });
  }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/by-email?email=${email}`);
  }

  isAdmin(email: string): Observable<boolean> {
    return of(true)
    /* return new Observable<boolean>((observer) => {
      this.getUserByEmail(email).subscribe(response => {
        const userRoles = response.data.roles || [];
        const isAdmin = userRoles.some((role: { name: string; }) => role.name === 'ADMIN');
        observer.next(isAdmin);
        observer.complete();
      }, error => {
        observer.next(false);
        observer.complete();
      });
    }); */
  }
  /* getUser(): Observable<any> {
    return of(null)
  } */
}
