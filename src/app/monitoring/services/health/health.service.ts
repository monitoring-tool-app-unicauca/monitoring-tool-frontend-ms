import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EndpointDTO } from '../../interfaces/EndpointDTO';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class HealthService {


  private apiUrl = environment.API_TRACKING_URL;

  private endpointToEditSubject = new BehaviorSubject<EndpointDTO | null>(null);
  endpointToEdit$ = this.endpointToEditSubject.asObservable();

  constructor(
    private http: HttpClient,
    private zone: NgZone
    ) {}


  setEndpointToEdit(endpoint: EndpointDTO) {
    console.log("Set endpoint ",endpoint)
    this.endpointToEditSubject.next(endpoint);
  }

  clear() {
    this.endpointToEditSubject.next(null);
  }
  createHealthEndpoint(payload: EndpointDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/health-endpoint`, payload);
  }
  updateHealthEndpoint(id: string | number, payload: any): Observable<any> {
    const url = `${this.apiUrl}/health-endpoint/${id}`;
    return this.http.patch(url, payload);
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
