import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { validarEmail, validarRequerido } from '../../utils/validacion';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports: [RouterLink],
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router);

  email = signal('');
  password = signal('');
  error = signal('');
  loading = signal(false);

  errEmail = signal('');
  errPassword = signal('');

  private limpiarErrores() {
    this.errEmail.set('');
    this.errPassword.set('');
    this.error.set('');
  }

  iniciarSesion() {
    this.limpiarErrores();

    this.errEmail.set(validarEmail(this.email()));
    this.errPassword.set(validarRequerido(this.password(), 'La contraseña'));

    if (this.errEmail() || this.errPassword()) return;

    this.loading.set(true);

    this.auth
      .login({
        email: this.email(),
        password: this.password(),
      })
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('refresh_token', res.refresh_token);
          localStorage.setItem('nombre', res.nombre);
          localStorage.setItem('email', res.email);
          localStorage.setItem('moneda', res.moneda || '$');
          this.router.navigate(['/app/dashboard']);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Error al iniciar sesión');
          this.loading.set(false);
        },
      });
  }
}
