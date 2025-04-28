import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ProjectDto } from '../../interfaces/projectDTO';
import { PageDTO } from '../../../shared/interfaces/PageDto';
@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiUrl = environment.API_TRACKING_URL;

  constructor(private http: HttpClient) {}

  createProject(project: ProjectDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/project`, project);
  }
  editProject(project: ProjectDto): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/project/${project.projectId}`, project);
  }
  getAllProjects(page: number, size: number, sort: string): Observable<PageDTO<ProjectDto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    return this.http.get<{ data: PageDTO<ProjectDto>; status: number; message: string }>(`${this.apiUrl}/project`, { params })
      .pipe(map(response => response.data));
  }

  deleteProject(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/project/${id}`);
  }
}
