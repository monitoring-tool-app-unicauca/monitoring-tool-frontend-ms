import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone} from '@angular/core';
import { Observable } from 'rxjs';
import { HealthEndpointDTO } from '../../interfaces/healthEndpointDTO';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class HealthService {

  private apiUrl = environment.API_TRACKING_URL;

  constructor(
    private http: HttpClient,
    private zone: NgZone
    ) {}

  createHealthEndpoint(payload: HealthEndpointDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/health-endpoint`, payload);
  }

  getHealthEndpointsByProject(projectId: string): Observable<any[]> {
    return new Observable(observer => {
      const url = `${this.apiUrl}/health-endpoint-stream/by-project?projectId=${projectId}`;
      const eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        this.zone.run(() => {
          try {
            const parsedData = JSON.parse(event.data);
            observer.next(parsedData.data); // <- Aquí emitimos solo el array de health endpoints
          } catch (e) {
            console.error('Error parsing SSE data:', e);
          }
        });
      };

      eventSource.onerror = (error) => {
        this.zone.run(() => {
          console.error('SSE connection error:', error);
          eventSource.close();
          observer.error(error);
        });
      };

      return () => {
        eventSource.close();
      };
    });
  }
}
