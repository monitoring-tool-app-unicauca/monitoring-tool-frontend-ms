import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { NgxToastrService } from '../../../_services/ngx-toastr/ngx-toastr.service';
import { UserDto } from '../../../admin/interfaces/userDTO';
import { APP_CONSTANTS } from '../../../../constants';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrl: './recovery-password.component.css'
})
export class RecoveryPasswordComponent {


  recoverForm!: FormGroup  ;
  hide_show: boolean = false;
  appName = APP_CONSTANTS.APP_NAME
  token: string="";
  passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService : AuthService,
    private route: ActivatedRoute,
    private alertService: NgxToastrService

  ) {}

  ngOnInit(){
    this.initForm();
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }


  initForm(){
    this.recoverForm = this.fb.group({
      password: ['', [Validators.required,Validators.pattern(this.passwordPattern)]],
      confirmPassword: ['', [Validators.required,Validators.pattern(this.passwordPattern)]],
      
    }, { validators: this.passwordsMatchValidator() });
  }

  passwordHide(){
    this.hide_show = !this.hide_show;
  }
  get password() {
    return this.recoverForm.get('password');
  }

  get confirmPassword() {
    return this.recoverForm.get('confirmPassword');
  }
  passwordsMatchValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordsMismatch: true };
  };
}


  onRecoverPassword(): void {
    if (this.recoverForm.invalid) {
      this.alertService.error('Please complete the form', 'toast-top-left');
      return;
    }

    const { password, confirmPassword} = this.recoverForm.value;

      const payload = {
      token: this.token,
      password,
      confirmPassword
    };
     this.authService.recoverPassword(payload).subscribe({
    next: (response) => {
      this.alertService.success('Password updated successfully', 'toast-top-left');

      // Redireccionar al login, por ejemplo
      this.router.navigate(['/login']);
    },
    error: (error) => {
      console.error('Error recovering password:', error);

      // Manejar errores 400 con campos
      if (error.status === 400 && Array.isArray(error?.error?.data)) {
        const fieldErrors = error.error.data.map((e: any) => `${e.field}: ${e.message}`).join('\n');
        this.alertService.error(fieldErrors, 'toast-top-left');
        return;
      }

      // Manejar otros errores como 403 u otros genéricos
      const errorMsg = error?.error?.message || 'An error occurred. Please try again.';
      this.alertService.error(errorMsg, 'toast-top-left');
    }
  });
  }

}
