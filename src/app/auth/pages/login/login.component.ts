import { Component } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { NgxToastrService } from '../../../_services/ngx-toastr/ngx-toastr.service';
import { UserDto } from '../../../admin/interfaces/userDTO';
import { APP_CONSTANTS } from '../../../../constants';
import { DecodedToken } from '../../interfaces/decodedToken';
import { jwtDecode } from "jwt-decode";
import { environment } from '../../../../environment/environment';

@Component({
  selector: 'app-login-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  loginForm!: FormGroup  ;
  hide_show: boolean = false;
  appName = APP_CONSTANTS.APP_NAME
  ADMIN_IDENTIFICATOR = environment.ADMIN_IDENTIFICATOR
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService : AuthService,
    private alertService: NgxToastrService,
    private route: ActivatedRoute

  ) {}

  ngOnInit(){
    this.initForm();
    this.route.queryParams.subscribe(params => {
      if (params['sessionExpired']) {
        this.alertService.error('Your session has expired. Please Login', 'toast-top-left');
      }
    });
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

          const decoded: DecodedToken = jwtDecode(token);

          const userDecoded: any = {
            email: decoded.sub,
            roles: decoded.roles.map(r => ({ name: r.authority })),
          };
          

          this.authService.getUserByEmail(userDecoded.email).subscribe(userResponse => {
          const userData: UserDto = userResponse.data;
          this.authService.setCurrentUser(userData);

          // obtener info de persona y ver si es un admin
          this.authService.setCurrentUser(userData);
          const isAdmin = userDecoded.roles?.some((role: { name: string; }) => role.name.toUpperCase() === this.ADMIN_IDENTIFICATOR );

          this.alertService.success('Successful login', 'toast-top-left');
          this.router.navigate([isAdmin ? '/admin' : '/monitoring']);
          })
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

