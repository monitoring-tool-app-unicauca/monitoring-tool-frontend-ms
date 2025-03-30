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

@Component({
  selector: 'app-app-edit-profile',
  templateUrl: './app-edit-profile.component.html',
  styleUrl: './app-edit-profile.component.css'
})
export class AppEditProfileComponent implements OnInit {

  profileForm!: FormGroup;
  passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/;
  emailExists:boolean | any = false;

  allRoles: RoleDto[] = [];
  roleSearchCtrl = new FormControl('');
  filteredRoles!: Observable<RoleDto[]>;
  selectedRoles= new MatTableDataSource<RoleDto>([]);

  displayedColumns: string[] = ['name', 'description','actions'];

  userId: string | null= null;
  imageFile: File | null = null;
  imagePreview: string | null = null;
  userProfileImage:string |null=null;
  defaultImage: string = "assets/images/user/default_tab.jpg";

  constructor(
    private fb: FormBuilder,
    private service:UserService,
    private roleService: RoleService,
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
        password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      });
    }
    cleanForm(){
      this.profileForm.reset()
    }
  ngOnInit() {
    this.initForm();
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

    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      // Aquí puedes llamar al servicio para obtener los datos del usuario
      console.log('Editando usuario con ID:', this.userId);
      this.service.getUserById(+this.userId).subscribe(response => {
        if (response?.data) {
          const userData = response.data;

          // Patching the form with user data
          this.profileForm.patchValue({
            userId: userData.userId,
            documentNumber: userData.documentNumber,
            name: userData.name,
            lastName: userData.lastName,
            phoneNumber: userData.phoneNumber,
            email: userData.email,

          });

          if (userData.roles ) {
            this.selectedRoles.data = [...userData.roles]; // Asigna los roles directamente

          }
          // Agregar la validación del email después de asignar los datos
          this.profileForm.get('email')?.setAsyncValidators(this.emailExistsValidator());

          if(this.userId)
          this.loadProfileImage(+this.userId);
         }
      });
    }

  }

  private _filterRoles(name: string): RoleDto[] {
    console.log("Texto ingresado para filtrar:", name);
    console.log("Lista de roles antes de filtrar:", this.allRoles);

    const filterValue = (name ?? '').toLowerCase();
    const filtered = this.allRoles.filter(role => role.name.toLowerCase().includes(filterValue));

    console.log("Lista de roles después de filtrar:", filtered);
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
        return of(null); // Si el campo está vacío, no validamos nada
      }

      return this.service.userExistByEmail(control.value).pipe(
        map((exists: boolean) => {

          return exists ? { emailExists: true } : null; // Si existe, activamos el error
        })
      );
    };
  }


  submitForm() {
    if (this.profileForm.valid) {

      const roleIds = this.selectedRoles.data.map(role => role.roleId);

    // Crear un objeto con los datos del formulario y agregar roleIds
    const requestData = {
      ...this.profileForm.value, // Incluye todos los datos del formulario
      roleIds: roleIds // Agrega el array de IDs de roles
    };

    if (this.userId) {
      this.service.updateUser(+this.userId, requestData).subscribe({
        next: (response) => {
          this.alertService.success('User updated successfully', 'toast-top-left');
          this.cleanForm();
          this.selectedRoles.data = [];
          if(this.userId && this.imageFile)
          this.uploadImage(+this.userId);
        },
        error: (error) => {
          console.error(error);
          this.alertService.error('Error updating user', 'toast-top-left');
        }
      });
    }else {
      this.service.createUser(requestData).subscribe({
        next: (response) => {
          // alert('User created successfully');

          this.alertService.success('User created successfully', 'toast-top-left');
          this.cleanForm()
          this.selectedRoles.data = []
          const newUserId = response.data?.id;  // ID del nuevo usuario
          if (newUserId && this.imageFile) {
            this.uploadImage(newUserId);  // Subir imagen después de crear
          }
        },
        error: (error) => {
          console.error(error);
          // alert('Error creating user');
          this.alertService.error('Error creating user', 'toast-top-left');
        }
      });
    }

    }
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
    }
  }

  uploadImage(userId: number) {
    if (!this.imageFile) return; // Si no hay imagen, no hacemos nada

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
  loadProfileImage(userId: number) {
    this.service.getUserImage(userId).subscribe({
      next: (imageBlob) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.userProfileImage = reader.result as string; // Convertir Blob a URL base64
        };
        reader.readAsDataURL(imageBlob);
      },
      error: () => {
        this.userProfileImage = this.defaultImage; // Usar imagen por defecto si hay error
      }
    });
  }

  get email() {
    return this.profileForm.get('email');
  }
  get password() {
    return this.profileForm.get('password');
  }

}


