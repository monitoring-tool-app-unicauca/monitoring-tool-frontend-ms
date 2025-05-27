export interface EndpointDTO {
  id?: number;
  projectId: string;
  url: string;
  active: boolean;
  notificationsEnabled: boolean;
  monitoringInterval: number;
}
