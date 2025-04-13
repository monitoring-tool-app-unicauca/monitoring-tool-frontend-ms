import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HealthEndpointDTO } from '../../interfaces/healthEndpointDTO';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class HealthService {

  private apiUrl = environment.API_TRACKING_URL;

  constructor(private http: HttpClient) {}

  createHealthEndpoint(payload: HealthEndpointDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/health-endpoint`, payload);
  }
}
