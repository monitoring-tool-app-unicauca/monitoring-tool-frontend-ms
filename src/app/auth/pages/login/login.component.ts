import { Component } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { NgxToastrService } from '../../../_services/ngx-toastr/ngx-toastr.service';
import { UserDto } from '../../../admin/interfaces/userDTO';

@Component({
  selector: 'app-login-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  loginForm!: FormGroup  ;
  hide_show: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService : AuthService,
    private alertService: NgxToastrService

  ) {}

  ngOnInit(){
    this.initForm();
  }


  initForm(){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  passwordHide(){
    this.hide_show = !this.hide_show;
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.alertService.error('Please complete the form', 'toast-top-left');
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        const token = response.data.token;

        if (token) {
          this.authService.saveToken(token);
          this.alertService.success('Succesfull login', 'toast-top-left');

          //obtener info de persona y ver si es un admin
          if (email) {
            this.authService.getUserByEmail(email).subscribe(userResponse => {
              const userData: UserDto = userResponse.data;
              this.authService.setCurrentUser(userData);

              const isAdmin = userData.roles?.some(role => role.roleId === 1);
              console.log("Is admin ? ",isAdmin)
              if (isAdmin) {
                this.router.navigate(['/admin']);
              } else {
                this.router.navigate(['/monitoring']);
              }
            });

          }
        } else {
          this.alertService.error('No Token', 'toast-top-left');
        }
      },
      error: (error) => {
        console.error("Error login:", error);
        const errorMsg = error?.error?.message || 'User or password incorrect';
        this.alertService.error(errorMsg, 'toast-top-left');
      }
    });
  }

}
