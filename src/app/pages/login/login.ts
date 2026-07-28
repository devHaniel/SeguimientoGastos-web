import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

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

  iniciarSesion() {
    if (!this.email() || !this.password()) {
      this.error.set('Todos los campos son obligatorios');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.auth
      .login({
        email: this.email(),
        password: this.password(),
      })
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
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
