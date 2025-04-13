export interface HealthEndpointDTO {
  id?: number;
  projectId: string;
  url: string;
  active: boolean;
  notificationsEnabled: boolean;
  monitoringInterval: number;
}
