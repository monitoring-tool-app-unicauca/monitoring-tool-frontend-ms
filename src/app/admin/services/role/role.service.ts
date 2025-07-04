import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoleDto } from '../../interfaces/roleDTO';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  

  private apiUrl = environment.API_USERS_URL;

  constructor(private http: HttpClient) {}

  createRole(dto :RoleDto):Observable<any>{

    return this.http.post<RoleDto>(`${this.apiUrl}/role`, dto );
  }

  getAllRoles():Observable<any>{

    return this.http.get<RoleDto>(`${this.apiUrl}/role` );
  }

  updateRole(id: number, data: any) {
    return this.http.patch(`${this.apiUrl}/role/${id}`, data);
  }

  deleteRole(id: number) {
    return this.http.delete(`${this.apiUrl}/role/${id}`);
  }
  
}
