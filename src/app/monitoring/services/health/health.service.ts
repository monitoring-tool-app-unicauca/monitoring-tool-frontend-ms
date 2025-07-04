import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone} from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, throwError } from 'rxjs';
import { EndpointDTO } from '../../interfaces/EndpointDTO';
import { environment } from '../../../../environment/environment';
import { HealthCheckDto } from '../../../shared/interfaces/HealthCheckDTO';

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

  deleteHealthEndpoint(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/health-endpoint/${id}`);
  }

  getHealthEndpointsByProject(projectId: string): Observable<any[]> {
    return new Observable(observer => {
      const url = `${this.apiUrl}/health-endpoint-stream/by-project?projectId=${projectId}`;
      const eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        this.zone.run(() => {
          try {
            const parsedData = JSON.parse(event.data);
            let healthData = parsedData.data;

            if (!Array.isArray(healthData)) {
              healthData = [healthData];
            }

            observer.next(healthData);
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

      // Cuando el observable se destruya, cerramos la conexión
      return () => {
        eventSource.close();
      };
    });
  }

  getHealthCheckByEndpointId(healthId:any):Observable<any>{

    return this.http.get<any>(`${this.apiUrl}/health-check/by-health?healthId=${healthId}`).pipe(
    catchError(error => {
      if (error.status === 403) {
        console.warn('Access forbidden for health check, returning empty list');
        return of([]); 
      }
      return throwError(() => error); 
    })
  );
  }
}
