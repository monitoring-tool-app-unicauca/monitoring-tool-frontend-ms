import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Select2Component } from '../../../../plugins/select2/select2.component';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { Observable, catchError, map, of, startWith, switchMap } from 'rxjs';
import { RoleDto } from '../../../interfaces/roleDTO';
import { RoleService } from '../../../services/role/role.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-app-edit-profile',
  templateUrl: './app-edit-profile.component.html',
  styleUrl: './app-edit-profile.component.css'
})
export class AppEditProfileComponent implements OnInit {

  profileForm!: FormGroup;
  passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/;
  emailExists:boolean | any = false;
  roleSearchCtrl = new FormControl('');
  filteredRoles!: Observable<RoleDto[]>;

  allRoles: RoleDto[] = [
    // { id: 1, name: 'Admin', description: 'Administrador' },
    // { id: 2, name: 'User', description: 'Usuario estándar' },
    // { id: 3, name: 'Manager', description: 'Gerente' }
    // Aquí deberías obtener los roles desde tu servicio en lugar de hardcodearlos.
  ];

  selectedRoles= new MatTableDataSource<RoleDto>([]);
  displayedColumns: string[] = ['name', 'description','actions'];
  constructor(
    private fb: FormBuilder,
    private service:UserService,
    private roleService: RoleService,
    private cdRef: ChangeDetectorRef // 👈 Importa esto
    ) {}

    initForm(){
      this.profileForm = this.fb.group({
        name: ['', Validators.required],
        lastName: ['', Validators.required],
        documentNumber: ['', Validators.required],
        phoneNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
        email: ['', [Validators.required, Validators.email], [this.emailExistsValidator()]],
        password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      });
    }
  ngOnInit() {
    this.initForm();
    this.roleService.getAllRoles().subscribe((data)=>{
      this.allRoles = data.data
      console.log("Allroles ",this.allRoles)
      setTimeout(() => {
        this.filteredRoles = of(this.allRoles);
      });
      this.cdRef.detectChanges();
    })
    /* this.filteredRoles = this.roleSearchCtrl.valueChanges.pipe(
      startWith(''),
      // map(value => (value && typeof value === 'string' ? value : value?.name ?? '')),
      map(name => (name ? this._filterRoles(name) : this.allRoles.slice()))
    ); */

    this.filteredRoles = this.roleSearchCtrl.valueChanges.pipe(
      startWith(''),
      map(name => (name ? this._filterRoles(name) : this.allRoles.slice()))
    );



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
      if (!control.value) {
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

      this.service.createUser(requestData).subscribe({
        next: (response) => {
          alert('User created successfully');
        },
        error: (error) => {
          console.error(error);
          alert('Error creating user');
        }
      });
    }
  }
  get email() {
    return this.profileForm.get('email');
  }
  get password() {
    return this.profileForm.get('password');
  }

}


