import { ProjectService } from './../../../monitoring/services/project/project.service';
// src/app/services/socket.service.ts
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, Subject } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { AuthService } from '../../../auth/services/auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: WebSocket | null = null;
  private messageSubject = new Subject<any>();
  public message$ = this.messageSubject.asObservable();
  private socketUrl = environment.SOCKET_NOTIFICATION_URL

  constructor(
    private projectService:ProjectService,
    private authService: AuthService
) {
    this.authService.currentUser$.subscribe(user => {
      
    if (user?.userId) {
      this.initSocket(user.userId);
    }
  });
  }

  async initSocket(userId:number) {
    
    // const storedUser = localStorage.getItem('current_user');
    // const user = storedUser ? JSON.parse(storedUser) : null;

    if (!userId) {
      console.warn("No se encontró userId en localStorage");
      return;
    }

    try {
      
      const response: any = await firstValueFrom(this.projectService.getProjectsByUser(userId));

      const projectIds: string[] = response?.data?.map((proj: any) => proj.projectId) || [];

      if (projectIds.length === 0) {
        console.warn("El usuario no tiene proyectos asignados");
        return;
      }

      this.socket = new WebSocket(this.socketUrl);

      this.socket.onopen = () => {
        console.log("Socket conectado");

        const subscriptionMessage = {
          type: "SUBSCRIBE",
          projects: projectIds
        };

        if (this.socket) {
          this.socket.send(JSON.stringify(subscriptionMessage));
        } else {
          console.error("Socket no está inicializado correctamente.");
        }
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.messageSubject.next(data);
        } catch (e) {
          console.error("Error parseando mensaje:", e);
        }
      };

      this.socket.onerror = (error) => console.error("Error de WebSocket", error);
    } catch (err) {
      console.error("Error al obtener proyectos:", err);
    }
  }

  listen(): Observable<any> {
    return this.message$;
  }

  disconnect() {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.close();
    }
  }
}
