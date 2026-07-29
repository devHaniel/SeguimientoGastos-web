import { Component, computed, inject, signal } from '@angular/core';
import { MovimientoService, Movimiento, MovimientoFilter } from '../../services/movimiento';
import { CategoriaService, Categoria } from '../../services/categoria';
import { MetodoPagoService, MetodoPago } from '../../services/metodo-pago';
import { formatoMonedaDecimal } from '../../utils/moneda';
import { validarRequerido, validarMonto } from '../../utils/validacion';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.html',
})
export class Movimientos {
  private movimientoService = inject(MovimientoService);
  private categoriaService = inject(CategoriaService);
  private metodoPagoService = inject(MetodoPagoService);

  movimientos = signal<Movimiento[]>([]);
  categorias = signal<Categoria[]>([]);
  metodosPago = signal<MetodoPago[]>([]);

  pagina = signal(0);
  tamanio = signal(10);
  totalPaginas = signal(0);
  totalElementos = signal(0);
  cargando = signal(false);

  categoriaMap = computed(() => {
    const map = new Map<string, Categoria>();
    for (const c of this.categorias()) map.set(c.id, c);
    return map;
  });

  metodoPagoMap = computed(() => {
    const map = new Map<string, MetodoPago>();
    for (const m of this.metodosPago()) map.set(m.id, m);
    return map;
  });

  filtroCategoriaId = signal('');
  filtroMetodoPagoId = signal('');
  filtroMes = signal(this.obtenerMesActual());
  filtroTipo = signal<'INGRESO' | 'GASTO' | ''>('');

  error = signal('');

  showModal = signal(false);
  editando = signal<Movimiento | null>(null);
  monto = signal(0);
  fecha = signal('');
  descripcion = signal('');
  categoriaId = signal('');
  metodoPagoId = signal('');
  loading = signal(false);

  errMonto = signal('');
  errFecha = signal('');
  errCategoria = signal('');
  errMetodoPago = signal('');

  hayAnterior = computed(() => this.pagina() > 0);
  haySiguiente = computed(() => this.pagina() < this.totalPaginas() - 1);

  constructor() {
    this.categoriaService.listar().subscribe((res) => this.categorias.set(res));
    this.metodoPagoService.listar().subscribe((res) => this.metodosPago.set(res));
    this.cargar();
  }

  private obtenerMesActual() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  private construirFiltro(): MovimientoFilter {
    const filtro: MovimientoFilter = {
      pagina: this.pagina(),
      tamanio: this.tamanio(),
    };

    const mes = this.filtroMes();
    if (mes && mes !== this.obtenerMesActual()) {
      filtro.fechaDesde = `${mes}-01`;
      const [y, m] = mes.split('-').map(Number);
      const ultimoDia = new Date(y, m, 0).getDate();
      filtro.fechaHasta = `${mes}-${String(ultimoDia).padStart(2, '0')}`;
    }

    if (this.filtroCategoriaId()) filtro.categoriaId = this.filtroCategoriaId();
    if (this.filtroMetodoPagoId()) filtro.metodoPagoId = this.filtroMetodoPagoId();
    const tipo = this.filtroTipo();
    if (tipo) filtro.tipo = tipo;

    return filtro;
  }

  cargar() {
    this.error.set('');
    this.cargando.set(true);
    this.movimientoService.listar(this.construirFiltro()).subscribe({
      next: (res) => {
        this.movimientos.set(res.contenido ?? []);
        this.pagina.set(res.pagina);
        this.totalPaginas.set(res.totalPaginas);
        this.totalElementos.set(res.totalElementos);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar movimientos', err);
        this.error.set(err.error?.message || 'Error al cargar movimientos');
        this.cargando.set(false);
      },
    });
  }

  aplicarFiltro() {
    this.pagina.set(0);
    this.cargar();
  }

  cambiarPagina(p: number) {
    this.pagina.set(p);
    this.cargar();
  }

  categoriasFiltradas = computed(() => {
    const tipo = this.filtroTipo();
    return tipo
      ? this.categorias().filter((c) => c.tipo === tipo)
      : this.categorias();
  });

  categoriasAgrupadas = computed(() => {
    const ingresos = this.categorias().filter((c) => c.tipo === 'INGRESO');
    const gastos = this.categorias().filter((c) => c.tipo === 'GASTO');
    return { ingresos, gastos };
  });

  abrirNuevo() {
    this.editando.set(null);
    this.monto.set(0);
    this.fecha.set(new Date().toISOString().slice(0, 10));
    this.descripcion.set('');
    this.categoriaId.set('');
    this.metodoPagoId.set('');
    this.errMonto.set('');
    this.errFecha.set('');
    this.errCategoria.set('');
    this.errMetodoPago.set('');
    this.showModal.set(true);
  }

  abrirEditar(m: Movimiento) {
    this.editando.set(m);
    this.monto.set(m.monto);
    this.fecha.set(m.fecha);
    this.descripcion.set(m.descripcion);
    this.categoriaId.set(m.categoriaId);
    this.metodoPagoId.set(m.metodoPagoId);
    this.errMonto.set('');
    this.errFecha.set('');
    this.errCategoria.set('');
    this.errMetodoPago.set('');
    this.showModal.set(true);
  }

  cerrarModal() {
    this.showModal.set(false);
  }

  guardar() {
    this.errMonto.set(validarMonto(this.monto()));
    this.errFecha.set(validarRequerido(this.fecha(), 'La fecha'));
    this.errCategoria.set(validarRequerido(this.categoriaId(), 'La categoría'));
    this.errMetodoPago.set(validarRequerido(this.metodoPagoId(), 'El método de pago'));

    if (this.errMonto() || this.errFecha() || this.errCategoria() || this.errMetodoPago()) return;

    this.loading.set(true);
    const data = {
      monto: this.monto(),
      fecha: this.fecha(),
      descripcion: this.descripcion(),
      categoriaId: this.categoriaId(),
      metodoPagoId: this.metodoPagoId(),
    };
    const request = this.editando()
      ? this.movimientoService.actualizar(this.editando()!.id, data)
      : this.movimientoService.crear(data);

    request.subscribe({
      next: () => {
        this.cargar();
        this.cerrarModal();
        this.loading.set(false);
      },
      error: () => (this.loading.set(false)),
    });
  }

  eliminar(m: Movimiento) {
    if (!confirm(`¿Eliminar movimiento del ${m.fecha} por ${formatoMonedaDecimal(m.monto)}?`)) return;
    this.movimientoService.eliminar(m.id).subscribe(() => this.cargar());
  }

  actualizarMonto(valor: string) {
    this.monto.set(parseFloat(valor) || 0);
  }

  protected formatoMonedaDecimal = formatoMonedaDecimal;
}
