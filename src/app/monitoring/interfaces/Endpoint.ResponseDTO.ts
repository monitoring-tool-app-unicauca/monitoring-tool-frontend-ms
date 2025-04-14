import { ProjectDto } from "./projectDTO";

export interface EndpointResponseDTO {
  id: number;
  url: string;
  status:  string;
  active: boolean;
  notificationsEnabled: boolean;
  lastCheckedAt: string;
  nextCheckedAt: string;
  responseTimeMs: number;
  project: ProjectDto;
}
