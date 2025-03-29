import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, debounceTime, map, of } from 'rxjs';
import { RoleDto } from '../../interfaces/roleDTO';
import { UserDto } from '../../interfaces/userDTO';
import { ResponseDto } from '../../../shared/interfaces/ResponseDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.API_USERS_URL;

  constructor(private http: HttpClient) {}

  createUser(dto :UserDto):Observable<any>{

    return this.http.post<UserDto>(`${this.apiUrl}/user`, dto );
  }
  updateUser(userId:number,dto :UserDto):Observable<any>{

    return this.http.patch<UserDto>(`${this.apiUrl}/user/${userId}`, dto );
  }

  userExistByEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/user/by-email?email=${email}`).pipe(
      map((response: any) => response.status === 200 && response.data ? true : false),
      catchError((error) => {
        if (error.status === 400) {

          return of(false);
        }

        return of(false);
      })
    );
  }

  getUsers(): Observable<UserDto[]> {
    return this.http.get<{ data: UserDto[]; status: number; message: string }>(`${this.apiUrl}/user`).pipe(
      map(response => response.data)
    );
  }

  getUserById(id:number): Observable<ResponseDto<UserDto>> {
    return this.http.get<ResponseDto<UserDto>>(`${this.apiUrl}/user/${id}`)
  }

}
