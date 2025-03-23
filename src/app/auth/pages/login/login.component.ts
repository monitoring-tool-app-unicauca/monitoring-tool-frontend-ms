import { Component } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = 'admin@email.com';
  password: string = '!?Gz0AHrp4';
  hide_show: boolean = false;
  loginForm!: FormGroup  ;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService : AuthService
  ) {}

  passwordHide(){
    this.hide_show = !this.hide_show;
  }
  url = '/admin/index'

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
  onLogin() {
    if (this.loginForm?.invalid) {
      console.log("Formulario inválido");
      return;
    }

    console.log('Login Data:', this.loginForm?.value);
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log("Login exitoso", response);
        //this.router.navigate(['/dashboard']); // Asegúrate de que esta ruta es correcta
      },
      error: (error) => {
        console.error("Error en el login", error);
        alert("Error al iniciar sesión: " + (error?.error?.message || "Inténtelo de nuevo"));
      }
    });

  }


}
