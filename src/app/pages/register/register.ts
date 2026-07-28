import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { validarEmail, validarRequerido, validarMinLength } from '../../utils/validacion';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  imports: [RouterLink],
})
export class Register {
  private auth = inject(Auth);
  private router = inject(Router);

  nombre = signal('');
  email = signal('');
  password = signal('');
  error = signal('');
  loading = signal(false);

  errNombre = signal('');
  errEmail = signal('');
  errPassword = signal('');

  private limpiarErrores() {
    this.errNombre.set('');
    this.errEmail.set('');
    this.errPassword.set('');
    this.error.set('');
  }

  registrar() {
    this.limpiarErrores();

    this.errNombre.set(validarRequerido(this.nombre(), 'El nombre') || validarMinLength(this.nombre(), 2, 'El nombre'));
    this.errEmail.set(validarEmail(this.email()));
    this.errPassword.set(validarRequerido(this.password(), 'La contraseña') || validarMinLength(this.password(), 6, 'La contraseña'));

    if (this.errNombre() || this.errEmail() || this.errPassword()) return;

    this.loading.set(true);

    this.auth
      .registrar({
        nombre: this.nombre(),
        email: this.email(),
        passwordHash: this.password(),
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Error al registrar');
          this.loading.set(false);
        },
      });
  }
}
