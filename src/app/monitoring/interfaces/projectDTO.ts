import { UserDto } from "../../admin/interfaces/userDTO";

export interface ProjectDto {
  projectId: string;
  projectName: string;
  projectDescription: string;
  users: UserDto[];
  minimumAllowedIntervalValue: number;
}
