import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectDto } from '../../interfaces/projectDTO';
@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiUrl = environment.API_TRACKING_URL;

  constructor(private http: HttpClient) {}

  createProject(project: ProjectDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/project`, project);
  }
}
