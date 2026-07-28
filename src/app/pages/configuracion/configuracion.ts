import { Component, inject, signal } from '@angular/core';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.html',
})
export class Configuracion {
  private usuarioService = inject(UsuarioService);

  nombre = signal(localStorage.getItem('nombre') || '');
  email = signal(localStorage.getItem('email') || '');
  moneda = signal(localStorage.getItem('moneda') || '$');
  loading = signal(false);
  error = signal('');
  exito = signal(false);

  constructor() {
    this.cargar();
  }

  private cargar() {
    this.loading.set(true);
    this.usuarioService.obtener().subscribe({
      next: (res) => {
        this.nombre.set(res.nombre);
        this.email.set(res.email);
        this.moneda.set(res.moneda);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  guardar() {
    if (!this.nombre()) {
      this.error.set('El nombre es obligatorio');
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.exito.set(false);

    this.usuarioService
      .actualizar({
        nombre: this.nombre(),
        moneda: this.moneda(),
      })
      .subscribe({
        next: () => {
          localStorage.setItem('nombre', this.nombre());
          localStorage.setItem('moneda', this.moneda());
          this.loading.set(false);
          this.exito.set(true);
          setTimeout(() => this.exito.set(false), 3000);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Error al guardar');
          this.loading.set(false);
        },
      });
  }
}
