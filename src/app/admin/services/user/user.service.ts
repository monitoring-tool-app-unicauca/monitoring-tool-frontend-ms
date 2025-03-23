import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, debounceTime, map, of } from 'rxjs';
import { RoleDto } from '../../interfaces/roleDTO';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.API_USERS_URL;

  constructor(private http: HttpClient) {}

  createUser(dto :RoleDto):Observable<any>{

    return this.http.post<RoleDto>(`${this.apiUrl}/user`, dto );
  }

  userExistByEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/user/by-email?email=${email}`).pipe(
      map((response: any) => response.status === 200 && response.data ? true : false),
      catchError((error) => {
        if (error.status === 400) {
          // No existe el email → No hay problema, devolvemos false sin errores
          return of(false);
        }
        // Si hay otro error (ejemplo, error de servidor 500), ahí sí lo mostramos
        return of(false);
      })
    );
  }


}
