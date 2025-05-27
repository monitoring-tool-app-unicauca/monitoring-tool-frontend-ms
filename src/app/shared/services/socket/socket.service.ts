import { ProjectService } from './../../../monitoring/services/project/project.service';
// src/app/services/socket.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { firstValueFrom, Observable, Subject } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: WebSocket;
  private messageSubject = new Subject<any>();
  public message$ = this.messageSubject.asObservable();
  private socketUrl = environment.SOCKET_NOTIFICATION_URL
  constructor(private projectService:ProjectService) {
    this.initSocket();
  }

  async initSocket() {
    const storedUser = localStorage.getItem('current_user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user?.userId) {
      console.warn("⚠️ No se encontró userId en localStorage");
      return;
    }

    try {
      
      const response: any = await firstValueFrom(this.projectService.getProjectsByUser(user.userId));

      const projectIds: string[] = response?.data?.map((proj: any) => proj.projectId) || [];

      if (projectIds.length === 0) {
        console.warn("⚠️ El usuario no tiene proyectos asignados");
        return;
      }

      this.socket = new WebSocket(this.socketUrl);

      this.socket.onopen = () => {
        console.log("Socket conectado");

        const subscriptionMessage = {
          type: "SUBSCRIBE",
          projects: projectIds
        };

        this.socket.send(JSON.stringify(subscriptionMessage));
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.messageSubject.next(data);
        } catch (e) {
          console.error("❌ Error parseando mensaje:", e);
        }
      };

      this.socket.onerror = (error) => console.error("🔴 Error de WebSocket", error);
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
