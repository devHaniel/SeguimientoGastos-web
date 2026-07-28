import { Component, inject, signal } from '@angular/core';
import { UsuarioService } from '../../services/usuario';
import { validarRequerido } from '../../utils/validacion';

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

  errNombre = signal('');
  errMoneda = signal('');

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
    this.errNombre.set(validarRequerido(this.nombre(), 'El nombre'));
    this.errMoneda.set(validarRequerido(this.moneda(), 'La moneda'));

    if (this.errNombre() || this.errMoneda()) return;

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
