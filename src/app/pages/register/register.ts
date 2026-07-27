import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

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

  registrar() {
    if (!this.nombre() || !this.email() || !this.password()) {
      this.error.set('Todos los campos son obligatorios');
      return;
    }

    this.loading.set(true);
    this.error.set('');

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
