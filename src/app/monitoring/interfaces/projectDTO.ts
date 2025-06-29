import { UserDto } from "../../admin/interfaces/userDTO";
import { EndpointDTO } from "./EndpointDTO";

export interface ProjectDto {
  projectId: string;
  projectName: string;
  projectDescription: string;
  users: UserDto[];
  minimumAllowedIntervalValue: number;
}

export interface ProjectCompleteResponseDto {
  projectId: string;
  projectName: string;
  projectDescription: string;
  minimumAllowedIntervalValue: number;
  healthEndpoints: EndpointDTO[];
  users: UserDto[];
}