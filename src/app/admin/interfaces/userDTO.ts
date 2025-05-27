import { RoleDto } from "./roleDTO";

export interface UserDto {
  userId?: number;
  documentNumber: string;
  name: string;
  lastName: string;
  phoneNumber: number;
  email: string;
  password?: string;
  roleIds?: number[];
  roles?: RoleDto[];

  userImage?:any;
}


