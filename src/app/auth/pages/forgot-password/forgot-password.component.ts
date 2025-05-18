import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_CONSTANTS } from '../../../../constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  url = '/admin/index'
 appName = APP_CONSTANTS.APP_NAME

 recoveryForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.recoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
  return this.recoveryForm.get('email')!;
}


  onSubmit(): void {
    if (this.recoveryForm.invalid) return;

    this.loading = true;
    const email = this.email.value;

    this.authService.forgotPassword(email).subscribe({
      next: (res) => {
        console.log(res)
        
        if (res?.status === 200) {
          this.toastr.success('Correo de recuperación enviado con éxito', 'Éxito');
        } else {
          
          this.toastr.warning(res.message || 'La solicitud fue procesada, pero hubo advertencias', 'Advertencia');
        }
        this.recoveryForm.reset();
        this.loading = false;
      },
      error: (err) => {
        const msg = err?.error?.message || 'No se pudo enviar el correo de recuperación';
        this.toastr.error(msg, 'Error');
        this.loading = false;
        console.error(err);
      }
    });


  }

}
