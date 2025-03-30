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
  toggleExample() {
    this.offcanvasExample = !this.offcanvasExample;
  }

  openCenter(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }

  @Input() offset_limit: any;
  @Input() checkbox: boolean = false;

  active = 1;
  page: any = 1;
  totalRows: number = 5;
  totalPage: any = 0;
  allData: any = [];
  boxActive: Boolean = false;

  users: UserDto[] = [];

  orderData: UserDto[] = [];
  constructor(
    private modalService: NgbModal,
    private userService: UserService
    ) {

  }
  ngOnInit(): void {
    this.fetchUsers();
    this.totalRows = this.offset_limit;
    this.allData = this.paginator(this.orderData, this.page, this.totalRows);
    this.totalPage = this.allData.total_pages;
  }
  fetchUsers() {
    this.userService.getUsers().subscribe((response) => {
      this.users = response;
      this.orderData = [...this.users];
      this.totalRows = this.users.length;
      this.allData = this.paginator(this.orderData, this.page, this.totalRows);
      this.totalPage = this.allData.total_pages;
    });
  }



  sortData(sort: Sort) {
    const data = this.users.slice();
    if (!sort.active || sort.direction === '') {
      this.orderData = data;
      return;
    }

    this.orderData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        // case 'userId': return compare(a.userId, b.userId, isAsc);
        case 'name': return compare(a.name, b.name, isAsc);
        case 'email': return compare(a.email, b.email, isAsc);
        case 'documentNumber': return compare(a.documentNumber, b.documentNumber, isAsc);
        case 'phoneNumber': return compare(a.phoneNumber, b.phoneNumber, isAsc);
        default: return 0;
      }
    });

    this.allData = this.paginator(this.orderData, this.page, this.totalRows);
  }
  pageChange(e: any) {
    this.page = e;
    this.allData = this.paginator(this.orderData, this.page, this.totalRows);
    this.totalPage = this.allData.total_pages;
  }

  paginator(items: any, current_page: any, per_page_items: any) {
    let page = current_page || 1,
      per_page = per_page_items || 10,
      offset = (page - 1) * per_page,
      paginatedItems = items.slice(offset).slice(0, per_page_items),
      total_pages = Math.ceil(items.length / per_page);

    return {
      page: page,
      per_page: per_page,
      pre_page: page - 1 ? page - 1 : null,
      next_page: (total_pages > page) ? page + 1 : null,
      total: items.length,
      total_pages: total_pages,
      data: paginatedItems
    };
  }

  checkUncheckAll() {
    if (this.boxActive) {
      this.boxActive = false;
    } else {
      this.boxActive = true;
    }
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
