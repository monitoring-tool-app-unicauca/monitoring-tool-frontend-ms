import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  uploadUserImage(userId: number, formData: FormData): Observable<any> {
    return this.http.patch(`${this.apiUrl}/user/${userId}/profile-image`, formData);
  }

  getUserImage(userId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/user/${userId}/profile-image`, { responseType: 'blob' });
  }

  getUsersByName(name: string | null): Observable<ResponseDto<UserDto[]>> {
    return this.http.get<ResponseDto<UserDto[]>>(`${this.apiUrl}/user/by-name?name=${name}`)
  }

  getUsersByIds(ids: number[]): Observable<ResponseDto<UserDto[]>> {
    const params = new HttpParams({ fromObject: { ids: ids.map(String) } });
    return this.http.get<ResponseDto<UserDto[]>>(`${this.apiUrl}/user/by-ids`, { params });
  }

}
