import { Component } from '@angular/core';
import { BreadcrumbComponent } from '../../../../elements/breadcrumb/breadcrumb.component';
import { MatSortModule, Sort } from '@angular/material/sort';
import { PaginationComponent } from '../../../../elements/pagination/pagination.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../../../services/role/role.service';
import { AuthService } from '../../../../auth/services/auth/auth.service';
import { UserService } from '../../../services/user/user.service';
import { NgxToastrService } from '../../../../_services/ngx-toastr/ngx-toastr.service';
import Swal from 'sweetalert2';

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
  editingRoleId: number | null = null;

  toggleExample(editing: boolean = false) {
  this.offcanvasExample = !this.offcanvasExample;
  if (!this.offcanvasExample) {
    this.cleanForm();
    this.editingRoleId = null;
  }
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
editRole(role: any) {
  this.editingRoleId = role.roleId;
  this.roleForm.patchValue({
    name: role.name,
    description: role.description
  });
  this.offcanvasExample = true;
}

deleteRole(roleId: number) {
  Swal.fire({
    title: 'Are you sure you want to delete this role?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then((result: { isConfirmed: any; }) => {
    if (result.isConfirmed) {
      this.roleService.deleteRole(roleId).subscribe({
        next: () => {
          this.alertService.success('Role deleted successfully', 'toast-top-right');
          if (this.selectedRoleId === roleId) {
            this.selectedRoleId = this.roles[0]?.roleId || null;
          }
          this.loadRoles();
        },
        error: (err: any) => {
          console.error(err);
          this.alertService.error('Error deleting role', 'toast-top-right');
        }
      });
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
    if (this.roleForm.invalid) return;

    const payload = this.roleForm.value;

    if (this.editingRoleId) {
      this.roleService.updateRole(this.editingRoleId, payload).subscribe({
        next: () => {
          this.alertService.success('Role updated successfully', 'toast-top-right');
          this.toggleExample();
          this.loadRoles();
        },
        error: (err: any) => {
          console.error(err);
          this.alertService.error('Error updating role', 'toast-top-right');
        }
      });
    } else {
      this.roleService.createRole(payload).subscribe({
        next: () => {
          this.alertService.success('Role created successfully', 'toast-top-right');
          this.toggleExample();
          this.loadRoles();
        },
        error: (err) => {
          console.error(err);
          this.alertService.error('Error creating role', 'toast-top-right');
        }
      });
    }
  }

  
  
}



