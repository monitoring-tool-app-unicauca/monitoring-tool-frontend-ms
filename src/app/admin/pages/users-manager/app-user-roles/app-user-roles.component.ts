import { Component } from '@angular/core';
import { BreadcrumbComponent } from '../../../../elements/breadcrumb/breadcrumb.component';
import { MatSortModule, Sort } from '@angular/material/sort';
import { PaginationComponent } from '../../../../elements/pagination/pagination.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../../../services/role/role.service';
import { AuthService } from '../../../../auth/services/auth/auth.service';
import { UserService } from '../../../services/user/user.service';
import { NgxToastrService } from '../../../../_services/ngx-toastr/ngx-toastr.service';

export interface Dessert {
  image: string,
  name: string;
  email: string;
  date: string;
  last_active: string;
}


@Component({
  selector: 'app-app-user-roles',
  templateUrl: './app-user-roles.component.html',
  styleUrl: './app-user-roles.component.css'
})
export class AppUserRolesComponent {
  breadcrumbList = {
    title: 'Dashboard',
    breadcrumb_path: 'Apps',
    currentURL: 'Roles Listing',
  }
  offcanvasExample: boolean = false;
  toggleExample() {
    this.offcanvasExample = !this.offcanvasExample;
  }

  isAdmin:boolean=false
  roleForm!: FormGroup;
  active = 1;
  page: any = 1;
  totalRows: number = 5;
  totalPage: any = 0;
  allData: any = [];

  roles: any[] = [];
  selectedRoleId: number  = 1;
  usersByRole: Dessert[] = [];
  searchTerm: string = '';
  
  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private userService: UserService,
    private authService: AuthService,
    private alertService: NgxToastrService
  ) {
    
  }
  ngOnInit(): void {
  this.isAdmin = this.authService.isAdmin();
  this.page = 1; 
  this.loadRoles();
  this.initForm();
}

loadRoles() {
  this.roleService.getAllRoles().subscribe({
    next: (roles) => {
      this.roles = roles.data;

      
      if (this.roles.length > 0) {
        const firstRoleId = this.roles[0].roleId;
        this.selectedRoleId = firstRoleId;
        this.loadUsersByRole(firstRoleId);
      }
    },
    error: (err) => {
      console.error('Error loading roles', err);
    }
  });
}


filteredRoles() {
  if (!this.searchTerm?.trim()) return this.roles;

  const term = this.searchTerm.toLowerCase();
  return this.roles.filter(role => role.name.toLowerCase().includes(term));
}

selectRole(roleId: number) {
  this.selectedRoleId = roleId;
  this.loadUsersByRole(roleId);
}
getRoleNameById(roleId: number): string | undefined {
  return this.roles.find(role => role.roleId == roleId)?.name;
}

loadUsersByRole(roleId: number) {
  this.userService.getUsersByRole(roleId).subscribe({
    next: (response) => {
      this.allData = response;
      this.totalRows = response.data?.totalElements || 0;
      this.totalPage = response.data?.totalPages || 1;
    },
    error: (err) => {
      console.error('Error fetching users by role', err);
    }
  });
}

  pageChange(e: any) {
    this.page = e;
    this.loadUsersByRole(this.selectedRoleId);  
  }

  initForm(){
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],

    });
  }
  cleanForm(){
    this.roleForm.reset()
  }
  submitForm() {
    if (this.roleForm.valid) {
      this.roleService.createRole(this.roleForm.value).subscribe({
        next: (response) => {
          this.alertService.success('Role has been created', 'toast-top-right');
          this.cleanForm()
          this.loadRoles()
        },
        error: (error) => {
          console.error(error);
          alert('Error creating Role');
        }
      });
    }
  }
  
  
}



