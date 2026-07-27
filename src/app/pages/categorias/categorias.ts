import { Component, inject, signal } from '@angular/core';
import { CategoriaService, Categoria } from '../../services/categoria';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.html',
})
export class Categorias {
  private categoriaService = inject(CategoriaService);

  categorias = signal<Categoria[]>([]);
  showModal = signal(false);
  editando = signal<Categoria | null>(null);
  nombre = signal('');
  tipo = signal<'INGRESO' | 'GASTO'>('INGRESO');
  loading = signal(false);

  constructor() {
    this.cargar();
  }

  cargar() {
    this.categoriaService.listar().subscribe((res) => this.categorias.set(res));
  }

  abrirNueva() {
    this.editando.set(null);
    this.nombre.set('');
    this.tipo.set('INGRESO');
    this.showModal.set(true);
  }

  abrirEditar(cat: Categoria) {
    this.editando.set(cat);
    this.nombre.set(cat.nombre);
    this.tipo.set(cat.tipo);
    this.showModal.set(true);
  }

  cerrarModal() {
    this.showModal.set(false);
  }

  guardar() {
    if (!this.nombre()) return;

    this.loading.set(true);
    const data = { nombre: this.nombre(), tipo: this.tipo() };
    const request = this.editando()
      ? this.categoriaService.actualizar(this.editando()!.id, data)
      : this.categoriaService.crear(data);

    request.subscribe({
      next: () => {
        this.cargar();
        this.cerrarModal();
        this.loading.set(false);
      },
      error: () => (this.loading.set(false)),
    });
  }

  eliminar(cat: Categoria) {
    if (!confirm(`¿Eliminar la categoría "${cat.nombre}"?`)) return;

    this.categoriaService.eliminar(cat.id).subscribe(() => this.cargar());
  }
}
