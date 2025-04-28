import { Component, Input, TemplateRef } from '@angular/core';
import { MatSortModule, Sort } from '@angular/material/sort';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user/user.service';
import { UserDto } from '../../../interfaces/userDTO';


export interface Dessert {
  employee_id: number
  userImage: string,
  userName: string,
  userPosition: string,
  userEmail: string,
  number: string,
  gender: string,
  status: string
  location: string
}
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent {
  offcanvasExample: boolean = false;



  @Input() offset_limit: any;
  @Input() checkbox: boolean = false;

  active = 1;
  page: any = 1;
  totalRows: number = 1;
  totalPage: any = 0;
  allData: any = [];
  boxActive: Boolean = false;

  users: UserDto[] = [];

  orderData: UserDto[] = [];
  constructor(

    private userService: UserService
    ) {

  }
  ngOnInit(): void {
    this.fetchUsers();

  }
  fetchUsers() {
    this.userService.getUsers(this.page-1).subscribe((response) => {


      if (response && response.data && Array.isArray(response.data.content)) {
        this.users = response.data.content.map((user: { userImage: any; }) => ({
          ...user,
          userImage: user.userImage ? user.userImage : 'assets/images/default_tab.png'
        }));
      } else {
        console.error('No se encontraron usuarios o la estructura de la respuesta es incorrecta');
        this.users = [];
      }

      this.orderData = [...this.users];
      this.totalRows = response.data.totalElements;
      this.totalPage = response.data.totalPages;
    });
  }



  pageChange(e: any) {
    this.page = e;
    this.fetchUsers();  // Realizamos la llamada al servicio para cargar los usuarios de la nueva página.
  }

  getUserImage(userId: number) {

  }

  checkUncheckAll() {
    if (this.boxActive) {
      this.boxActive = false;
    } else {
      this.boxActive = true;
    }
  }
}


