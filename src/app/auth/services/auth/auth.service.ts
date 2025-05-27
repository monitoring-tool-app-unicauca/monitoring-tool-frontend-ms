import { SocketService } from './../../../shared/services/socket/socket.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { UserDto } from '../../../admin/interfaces/userDTO';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.API_USERS_URL;
  private TOKEN_KEY = 'auth_token';
  private USER_KEY ='current_user';
  private currentUser!: UserDto ;
  private isAdminUser: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,

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
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/auth/login'])
  }


  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setCurrentUser(user: any): void {
    this.currentUser = user;
    this.isAdminUser = user?.roles?.some((role: { roleId: number }) => role.roleId === 1);

    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    console.log("Set current user ",this.currentUser,"isAdmin:", this.isAdminUser)
  }

  getCurrentUser(): any {
    if (this.currentUser) {
      return this.currentUser;
    }
    const storedUser = localStorage.getItem(this.USER_KEY);
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    
    if (parsedUser && !this.currentUser) {
      this.currentUser = parsedUser;
      this.isAdminUser = parsedUser?.roles?.some((role: { roleId: number }) => role.roleId === 1);
    }

    return parsedUser;
  }

   forgotPassword(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.post(`${this.apiUrl}/user/forgot-password`, null, { params });
  }

  recoverPassword(payload:any):Observable<any> {
    
    return this.http.patch<any>(`${this.apiUrl}/user/reset-password`, payload);
  }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/by-email?email=${email}`);
  }

  isAdmin(): boolean {
    return this.isAdminUser;
  }


}
