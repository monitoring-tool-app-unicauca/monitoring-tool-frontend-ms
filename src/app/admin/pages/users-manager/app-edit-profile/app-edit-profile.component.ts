import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Select2Component } from '../../../../plugins/select2/select2.component';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { Observable, catchError, map, of, startWith, switchMap } from 'rxjs';
import { RoleDto } from '../../../interfaces/roleDTO';
import { RoleService } from '../../../services/role/role.service';
import { MatTableDataSource } from '@angular/material/table';
import { NgxToastrService } from '../../../../_services/ngx-toastr/ngx-toastr.service';
import { Breadcrumb } from '../../../../shared/interfaces/Breadcrum.interface';
import { ProjectDto } from '../../../../monitoring/interfaces/projectDTO';
import { ProjectService } from '../../../../monitoring/services/project/project.service';

@Component({
  selector: 'app-app-edit-profile',
  templateUrl: './app-edit-profile.component.html',
  styleUrl: './app-edit-profile.component.css'
})
export class AppEditProfileComponent implements OnInit {

 
  breadcrumbList!: Breadcrumb 

  profileForm!: FormGroup;
  // passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/;
  emailExists:boolean | any = false;

  allRoles: RoleDto[] = [];
  roleSearchCtrl = new FormControl('');
  filteredRoles!: Observable<RoleDto[]>;
  selectedRoles= new MatTableDataSource<RoleDto>([]);

  displayedColumns: string[] = ['name', 'description','actions'];

  projects: ProjectDto[] = [];
  projectsLoaded: boolean = false;
  showProjects = false;


  userId: string | null= null;
  imageFile: File | null = null;
  imagePreview: string | null = null;
  userProfileImage:string |null=null;
  defaultImage: string = "assets/images/user/default_tab.jpg";

  constructor(
    private fb: FormBuilder,
    private service:UserService,
    private roleService: RoleService,
    private projectService: ProjectService,
    private cdRef: ChangeDetectorRef,
    private alertService: NgxToastrService,
    private route: ActivatedRoute
    ) {}

    initForm(){
      this.profileForm = this.fb.group({
        userId:[''],
        name: ['', Validators.required],
        lastName: ['', Validators.required],
        documentNumber: ['', Validators.required],
        phoneNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
        email: ['', [Validators.required, Validators.email], [this.emailExistsValidator()]],
        // password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      });
    }
  ngOnInit() {
    this.initForm();
    this.userId = this.route.snapshot.paramMap.get('id');
    this.breadcrumbList= {
      title: 'User',
      subTitle: this.userId ? 'Edit User': 'Add User',
      items: [
        { label: 'Home', url: '/admin/index' },
        { label: 'Users', url: '/admin/users' },
        { label: this.userId ? 'Edit User': 'Add User' }
      ]
    };

    this.roleService.getAllRoles().subscribe((data)=>{
      this.allRoles = data.data

      setTimeout(() => {
        this.filteredRoles = of(this.allRoles);
      });
      this.cdRef.detectChanges();
    })


    this.filteredRoles = this.roleSearchCtrl.valueChanges.pipe(
      startWith(''),
      map(name => (name ? this._filterRoles(name) : this.allRoles.slice()))
    );

    
    if (this.userId) {
      this.loadUser(+this.userId)
      this.loadProjects(+this.userId);
      
    }

  }
  loadUser(userId:number){
    this.service.getUserById(userId).subscribe(response => {
        if (response?.data) {
          const userData = response.data;


          this.profileForm.patchValue({
            userId: userData.userId,
            documentNumber: userData.documentNumber,
            name: userData.name,
            lastName: userData.lastName,
            phoneNumber: userData.phoneNumber,
            email: userData.email,

          });

          if (userData.roles ) {
            this.selectedRoles.data = [...userData.roles];

          }

          this.profileForm.get('email')?.setAsyncValidators(this.emailExistsValidator());

          if(this.userId)
          this.loadProfileImage(this.userId);
         }
      });
  }
  loadProjects(userId: number) {
    this.projectService.getProjectsByUser(userId).subscribe({
      next: (res) => {
        this.projects = res.data || [];
        this.projectsLoaded = true;
      },
      error: (err) => {
        console.error('Error loading projects', err);
        this.projectsLoaded = true;
      }
    });
}
  private _filterRoles(name: string): RoleDto[] {

    const filterValue = (name ?? '').toLowerCase();
    const filtered = this.allRoles.filter(role => role.name.toLowerCase().includes(filterValue));

    return filtered;
  }


  addRole(role: RoleDto) {
    if (!this.selectedRoles.data.some(r => r.roleId === role.roleId)) {
      this.selectedRoles.data = [...this.selectedRoles.data, role];
    }
    this.roleSearchCtrl.setValue('');
  }

  removeRole(role: RoleDto) {
    this.selectedRoles.data = this.selectedRoles.data.filter(r => r.roleId !== role.roleId);
  }



  emailExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<any | null> => {
      if (!control.value || control.value === this.profileForm?.get('email')?.value) {
        return of(null);
      }

      return this.service.userExistByEmail(control.value).pipe(
        map((exists: boolean) => {

          return exists ? { emailExists: true } : null;
        })
      );
    };
  }


  submitForm() {
    if (this.profileForm.valid) {
      const roleIds = this.selectedRoles.data.map(role => role.roleId);


      const requestData = {
        ...this.profileForm.value,
        roleIds: roleIds
      };

      if (this.userId) {

        this.service.updateUser(+this.userId, requestData).subscribe({
          next: (response) => {
            this.alertService.success('User updated successfully', 'toast-top-left');
            this.cleanForm();
            this.selectedRoles.data = [];
            if (this.imageFile&&this.userId) {
              this.uploadImage(+this.userId);
            }
          },
          error: (error) => {
            console.error(error);
            this.alertService.error('Error updating user', 'toast-top-left');
          }
        });
      } else {
        // Crear nuevo usuario
        this.service.createUser(requestData).subscribe({
          next: (response) => {
            this.alertService.success('User created successfully', 'toast-top-left');
            this.selectedRoles.data = [];
            const newUserId = response.data?.userId;


            if (newUserId && this.imageFile) {
              this.uploadImage(newUserId);
            }
            this.cleanForm();
          },
          error: (error) => {
            console.error(error);
            this.alertService.error('Error creating user', 'toast-top-left');
          }
        });
      }
    }
  }

cleanForm() {
    this.profileForm.reset();
    this.imagePreview = null;
    this.imageFile = null;
    this.userProfileImage = this.defaultImage;
}



  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
      this.imageFile = file;

      if(this.userId)
        this.uploadImage(+this.userId);
    }
  }

  uploadImage(userId: number) {
    if (!this.imageFile) {
      console.log("No image file to upload");
      return;
    }

    const formData = new FormData();
    formData.append('file', this.imageFile);

    this.service.uploadUserImage(userId, formData).subscribe({
      next: () => {
        this.alertService.success('Profile image uploaded successfully', 'toast-top-left');
      },
      error: (error) => {
        console.error(error);
        this.alertService.error('Error uploading profile image', 'toast-top-left');
      }
    });
  }
  loadProfileImage(userId: string) {

    let userImage = this.defaultImage;

    if (userId !== undefined) {
      this.service.getUserImage(+userId).subscribe({
        next: (blob) => {

          if (blob && blob.size > 0) {
            const reader = new FileReader();
            reader.onload = () => {
              userImage = reader.result as string;
              this.userProfileImage = userImage;
              this.cdRef.detectChanges();
            };
            reader.readAsDataURL(blob);
          } else {
            this.userProfileImage = userImage;
          }
        },
        error: () => {

          this.userProfileImage = userImage;
        }
      });
    } else {
      this.userProfileImage = userImage;
    }
  }

  get email() {
    return this.profileForm.get('email');
  }
  // get password() {
  //   return this.profileForm.get('password');
  // }

}


