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
import { Router } from '@angular/router';
import { AuthService } from '../../../../auth/services/auth/auth.service';
import { Breadcrumb } from '../../../../shared/interfaces/Breadcrum.interface';

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

  breadcrumbList!: Breadcrumb 

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

  isAdmin:boolean=false;
  selectedUsers: UserDto[] =[]//new MatTableDataSource<UserDto>([]);
  userColumns: string[] = ['name', 'email', 'actions'];
  isEditMode: boolean = false;
  showDetails:boolean = false;
  selectedProject: any= null;
  constructor(
    private fb: FormBuilder,
    private alertService: NgxToastrService,
    private projectService: ProjectService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {



  }
  initForm(){
    this.projectForm = this.fb.group({
      projectId: ['', [Validators.required, Validators.min(1)]],
      projectName: ['', [Validators.required, Validators.minLength(3)]],
      projectDescription: ['', [Validators.required, Validators.minLength(5)]],
      minimumAllowedIntervalValue: [null, [Validators.required, Validators.min(1)]],
    });
  }
  cleanForm(){
    this.projectForm.reset()
  }
  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.loadProjects()
    this.initForm()

    this.filteredUsers = this.userSearchCtrl.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => this.userService.getUsersByName(value).pipe(
        map(response => response.data || [])
      ))
    );
    this.breadcrumbList= {
      title: 'Projects',
      subTitle:  'Edit User',
      items: [
        { label: 'Home', url: '/admin/index' },
        { label: 'Projects', }
        
      ]
    };
  }
  addUser(user: UserDto) {

    if (!this.selectedUsers.some(u=>u.userId === user.userId)) {
      this.selectedUsers = [...this.selectedUsers, user];
    }

    this.userSearchCtrl.setValue('');
  }

  removeUser(user: UserDto) {
    this.selectedUsers = this.selectedUsers.filter(u => u.userId !== user.userId);

  }
  loadProjects(): void {
    const sort = 'projectId,asc';
    const size = this.totalRows;
    const page = this.page - 1;

    this.projectService.getAllProjects(page, size, sort).subscribe({
      next: (response) => {
        this.projects = response.content;
        this.totalPage = response.totalPages;
        this.totalRows = response.totalElements;
        this.allData = { data: this.projects };
      },
      error: (err) => {
        console.error('Error loading projects:', err);
      }
    });
  }

  editProject(project: any): void {

    this.isEditMode = true;
    this.projectForm.patchValue({
      projectId: project.projectId,
      projectName: project.projectName,
      projectDescription: project.projectDescription,
      minimumAllowedIntervalValue: project.minimumAllowedIntervalValue,
    });

    // Deshabilitar el campo projectId para que no se edite
    this.projectForm.get('projectId')?.disable();

    this.selectedUsers=project.users

  }
  onCancelEdit(){
    this.projectForm.reset()
    this.selectedUsers = []
    this.isEditMode = false;

  }
  toggleDetails(project : any){

    this.showDetails = !this.showDetails
    if(project!=null) this.selectedProject = project
    if(project==null) this.loadProjects()
  }
  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      console.log('Form Invalid');
      return;
    }

    const userIds = this.selectedUsers.map(user => user.userId);
    const formValue = this.projectForm.getRawValue();
    const requestData = {
      ...formValue,
      responsibleUserIds: userIds
    };

    if (this.isEditMode) {
      this.projectService.editProject(requestData).subscribe({
        next: (response) => {


          this.alertService.success('Project updated successfully', 'toast-top-left');
          this.cleanForm()
          this.loadProjects();
          this.selectedUsers = []

        },
        error: (error) => {
          console.error(error);

          this.alertService.error('Error updating project', 'toast-top-left');
        }
      })
    } else {
      this.projectService.createProject(requestData).subscribe({
        next: (response) => {


          this.alertService.success('Project created successfully', 'toast-top-left');
          this.cleanForm()
          this.loadProjects();
          this.selectedUsers = []

        },
        error: (error) => {
          console.error(error);

          this.alertService.error('Error creating project', 'toast-top-left');
        }
      });

    }

    this.projectForm.reset();
    this.projectForm.get('projectId')?.enable();
    this.selectedUsers = [];
    this.isEditMode = false;

  }

  trackByFn(index: number, item: ProjectDto): string {
    return item.projectId;
  }


  pageChange(e: any) {
    this.page = e;
    this.loadProjects();
  }

}

