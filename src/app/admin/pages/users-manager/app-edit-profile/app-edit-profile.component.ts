import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Select2Component } from '../../../../plugins/select2/select2.component';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { Observable, catchError, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-app-edit-profile',
  templateUrl: './app-edit-profile.component.html',
  styleUrl: './app-edit-profile.component.css'
})
export class AppEditProfileComponent implements OnInit {

  profileForm!: FormGroup;
  passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/;
  emailExists:boolean | any = false;
  constructor(
    private fb: FormBuilder,
    private service:UserService
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
      this.service.createUser(this.profileForm.value).subscribe({
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
  selectGender = [
    {
      name: 'Please select',
    },
    {
      name: 'Male',
    },
    {
      name: 'Female',
    },
    {
      name: 'Other',
    }
  ];
  selectCountry = [
    {
      name: 'Please select',
    },
    {
      name: 'Russia',
    },
    {
      name: 'Canada',
    },
    {
      name: 'China',
    },
    {
      name: 'India',
    }
  ];
  selectCity = [
    {
      name: 'Please select',
    },
    {
      name: 'Krasnodar',
    },
    {
      name: 'Tyumen',
    },
    {
      name: 'Chelyabinsk',
    },
    {
      name: 'Moscow',
    }
  ];
}


