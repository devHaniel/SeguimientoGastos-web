import { Component, computed, inject, signal } from '@angular/core';
import { MetodoPagoService, MetodoPago } from '../../services/metodo-pago';
import { Movimiento } from '../../services/movimiento';
import { CategoriaService, Categoria } from '../../services/categoria';
import { formatoMoneda } from '../../utils/moneda';
import { validarRequerido } from '../../utils/validacion';

@Component({
  selector: 'app-metodos-pago',
  templateUrl: './metodos-pago.html',
})
export class MetodosPago {
  private service = inject(MetodoPagoService);
  private categoriaService = inject(CategoriaService);

  metodos = signal<MetodoPago[]>([]);
  categorias = signal<Categoria[]>([]);
  categoriaMap = computed(() => {
    const map = new Map<string, Categoria>();
    for (const c of this.categorias()) map.set(c.id, c);
    return map;
  });

  showModal = signal(false);
  editando = signal<MetodoPago | null>(null);
  nombre = signal('');
  tipo = signal<'EFECTIVO' | 'TARJETA_DEBITO' | 'TARJETA_CREDITO'>('EFECTIVO');
  loading = signal(false);

  errNombre = signal('');

  selectedMetodo = signal<MetodoPago | null>(null);
  movimientos = signal<Movimiento[]>([]);
  loadingMovs = signal(false);

  totalIngresos = computed(() =>
    this.movimientos().reduce((sum, m) => {
      const cat = this.categoriaMap().get(m.categoriaId);
      return cat?.tipo === 'INGRESO' ? sum + m.monto : sum;
    }, 0)
  );

  totalGastos = computed(() =>
    this.movimientos().reduce((sum, m) => {
      const cat = this.categoriaMap().get(m.categoriaId);
      return cat?.tipo === 'GASTO' ? sum + m.monto : sum;
    }, 0)
  );

  cantidadMovimientos = computed(() => this.movimientos().length);

  movimientosAgrupados = computed(() => {
    const movs = this.movimientos();
    const grupos: { year: string; months: { month: string; days: { day: string; movimientos: Movimiento[] }[] }[] }[] = [];

    for (const m of movs) {
      const [y, mo, d] = m.fecha.split('-');
      const monthKey = `${y}-${mo}`;
      const dayKey = m.fecha;

      let yearGroup = grupos.find((g) => g.year === y);
      if (!yearGroup) {
        yearGroup = { year: y, months: [] };
        grupos.push(yearGroup);
      }

      let monthGroup = yearGroup.months.find((g) => g.month === monthKey);
      if (!monthGroup) {
        monthGroup = { month: monthKey, days: [] };
        yearGroup.months.push(monthGroup);
      }

      let dayGroup = monthGroup.days.find((g) => g.day === dayKey);
      if (!dayGroup) {
        dayGroup = { day: dayKey, movimientos: [] };
        monthGroup.days.push(dayGroup);
      }

      dayGroup.movimientos.push(m);
    }

    for (const yg of grupos) {
      for (const mg of yg.months) {
        mg.days.sort((a, b) => b.day.localeCompare(a.day));
      }
      yg.months.sort((a, b) => b.month.localeCompare(a.month));
    }
    grupos.sort((a, b) => b.year.localeCompare(a.year));

    return grupos;
  });

  constructor() {
    this.categoriaService.listar().subscribe((res) => this.categorias.set(res));
    this.cargar();
  }

  cargar() {
    this.service.listar().subscribe((res) => this.metodos.set(res));
  }

  verMovimientos(m: MetodoPago) {
    this.selectedMetodo.set(m);
    this.loadingMovs.set(true);
    this.service.movimientos(m.id, { tamanio: 10000 }).subscribe({
      next: (res) => {
        this.movimientos.set(res.contenido);
        this.loadingMovs.set(false);
      },
      error: () => (this.loadingMovs.set(false)),
    });
  }

  volver() {
    this.selectedMetodo.set(null);
    this.movimientos.set([]);
  }

  abrirNuevo() {
    this.editando.set(null);
    this.nombre.set('');
    this.tipo.set('EFECTIVO');
    this.errNombre.set('');
    this.showModal.set(true);
  }

  abrirEditar(m: MetodoPago) {
    this.editando.set(m);
    this.nombre.set(m.nombre);
    this.tipo.set(m.tipo);
    this.errNombre.set('');
    this.showModal.set(true);
  }

  cerrarModal() {
    this.showModal.set(false);
  }

  guardar() {
    this.errNombre.set(validarRequerido(this.nombre(), 'El nombre'));
    if (this.errNombre()) return;

    this.loading.set(true);
    const data = { nombre: this.nombre(), tipo: this.tipo() };
    const request = this.editando()
      ? this.service.actualizar(this.editando()!.id, data)
      : this.service.crear(data);

    request.subscribe({
      next: () => {
        this.cargar();
        this.cerrarModal();
        this.loading.set(false);
      },
      error: () => (this.loading.set(false)),
    });
  }

  eliminar(m: MetodoPago) {
    if (!confirm(`¿Eliminar método de pago "${m.nombre}"?`)) return;
    this.service.eliminar(m.id).subscribe(() => this.cargar());
  }

  protected formatoMoneda = formatoMoneda;
}
