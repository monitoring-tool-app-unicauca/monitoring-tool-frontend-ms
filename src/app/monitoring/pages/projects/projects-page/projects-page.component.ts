import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { ProjectService } from '../../../services/project/project.service';
import { NgxToastrService } from '../../../../_services/ngx-toastr/ngx-toastr.service';
import { ProjectDto } from '../../../interfaces/projectDTO';
import { Observable, debounceTime, map, switchMap } from 'rxjs';
import { UserDto } from '../../../../admin/interfaces/userDTO';
import { UserService } from '../../../../admin/services/user/user.service';
import { MatTableDataSource } from '@angular/material/table';

export interface Dessert {
  account_title: string,
  amount: number;
  account_no: number;
  branch_code: number;
  branch_name: string;
}
@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.css'
})
export class ProjectsPageComponent {

  breadcrumbList = {
    title: 'Projects',
    breadcrumb_path: 'Home',
    currentURL: 'Projects',
  }

  active = 1;
  page: any = 1;
  totalRows: number = 8;
  totalPage: any = 0;
  allData: any = [];

  projectForm!: FormGroup;
  projects: ProjectDto[]=[];
  orderData: ProjectDto[]=[]

  userSearchCtrl = new FormControl('');
  filteredUsers!: Observable<UserDto[]>;


  selectedUsers= new MatTableDataSource<UserDto>([]);
  userColumns: string[] = ['name', 'email', 'actions'];
  constructor(
    private fb: FormBuilder,
    private alertService: NgxToastrService,
    private projectService: ProjectService,
    private userService: UserService,
  ) {



  }
  initForm(){
    this.projectForm = this.fb.group({
      projectId: ['', [Validators.required, Validators.min(1)]],
      projectName: ['', [Validators.required, Validators.minLength(3)]],
      projectDescription: ['', [Validators.required, Validators.minLength(5)]]
    });
  }
  cleanForm(){
    this.projectForm.reset()
  }
  ngOnInit(): void {
    this.loadProjects()
    this.initForm()
    this.allData = this.paginator(this.orderData, this.page, this.totalRows);
    this.totalPage = this.allData.total_pages;

    this.filteredUsers = this.userSearchCtrl.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => this.userService.getUsersByName(value).pipe(
        map(response => response.data || [])
      ))
    );
  }
  addUser(user: UserDto) {

    if (!this.selectedUsers.data.some(u=>u.userId === user.userId)) {
      this.selectedUsers.data = [...this.selectedUsers.data, user];
    }

    this.userSearchCtrl.setValue('');
  }

  removeUser(user: UserDto) {
    this.selectedUsers.data = this.selectedUsers.data.filter(u => u.userId !== user.userId);

  }
  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (response) => {
        this.projects = response;
        this.orderData = [...this.projects]
        this.totalRows = this.projects.length;
        this.allData = this.paginator(this.orderData, this.page, this.totalRows);
        this.totalPage = this.allData.total_pages;
      },
      error: (err) => {
        console.error('Error loading projects:', err);
      }
    });
  }
  onSubmit(): void {
    if (this.projectForm.valid) {
      const userIds = this.selectedUsers.data.map(user => user.userId);
      const requestData = {
        ...this.projectForm.value,
        responsibleUserIds: userIds
      };
      this.projectService.createProject(requestData).subscribe({
        next: (response) => {


          this.alertService.success('Project created successfully', 'toast-top-left');
          this.cleanForm()
          this.loadProjects();
          this.selectedUsers.data = []

        },
        error: (error) => {
          console.error(error);

          this.alertService.error('Error creating project', 'toast-top-left');
        }
      });
    } else {
      console.log('Form Invalid');
    }
  }

  trackByFn(index: number, item: ProjectDto): string {
    return item.projectId;
  }
  sortData(sort: Sort) {
    const data = this.projects.slice();
    if (!sort.active || sort.direction === '') {
      this.orderData = data;
      return;
    }

    this.orderData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'project_name': return compare(a.projectName, b.projectName, isAsc);
        case 'project_id': return compare(a.projectId, b.projectId, isAsc);
        case 'project_description': return compare(a.projectDescription, b.projectDescription, isAsc);
        default: return 0;
      }
    });
    this.allData = this.paginator(this.orderData, this.page, this.totalRows);
  }

  pageChange(e: any) {    //  Page Change funcation   ---------
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
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
