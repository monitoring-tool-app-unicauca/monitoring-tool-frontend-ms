import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { UserDto } from '../../../admin/interfaces/userDTO';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.API_USERS_URL;
  private TOKEN_KEY = 'auth_token';
  private currentUser!: UserDto ;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}


  validateEmail(email: string): Observable<{ available: boolean }> {
    return this.http.get<{ available: boolean }>(`${this.apiUrl}/user/by-email?email=${email}`);
  }
  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { name, email, password });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  login(username: string, password: string):Observable<any> {
    const payload = { username, password };
    return this.http.post<any>(`${this.apiUrl}/user/authenticate`, payload);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }


  logout(): void {

    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/auth/login'])
  }


  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

setCurrentUser(user: any): void {
  this.currentUser = user;
  localStorage.setItem('current_user', JSON.stringify(user));
  console.log("Set current user ",this.currentUser)
}

getCurrentUser(): any {
  if (this.currentUser) {
    return this.currentUser;
  }
  const storedUser = localStorage.getItem('current_user');
  return storedUser ? JSON.parse(storedUser) : null;
}

  recoverPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recover-password`, { email });
  }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/by-email?email=${email}`);
  }


}
