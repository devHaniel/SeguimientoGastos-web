import { Component, computed, inject, signal } from '@angular/core';
import { MovimientoService, Movimiento } from '../../services/movimiento';
import { CategoriaService, Categoria } from '../../services/categoria';
import { formatoMoneda } from '../../utils/moneda';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private movimientoService = inject(MovimientoService);
  private categoriaService = inject(CategoriaService);

  protected nombre = localStorage.getItem('nombre') || 'Usuario';

  movimientos = signal<Movimiento[]>([]);
  categorias = signal<Categoria[]>([]);
  categoriaMap = computed(() => {
    const map = new Map<string, Categoria>();
    for (const c of this.categorias()) map.set(c.id, c);
    return map;
  });

  hoy = new Date();
  hoyStr = this.hoy.toISOString().slice(0, 10);
  mesStr = this.hoy.toISOString().slice(0, 7);

  movimientosHoy = computed(() =>
    this.movimientos().filter((m) => m.fecha === this.hoyStr)
  );

  movimientosMes = computed(() =>
    this.movimientos().filter((m) => m.fecha.startsWith(this.mesStr))
  );

  saldoHoy = computed(() => this.calcularSaldo(this.movimientosHoy()));
  saldoMes = computed(() => this.calcularSaldo(this.movimientosMes()));

  mayoresGastos = computed(() =>
    this.movimientosMes()
      .filter((m) => this.categoriaMap().get(m.categoriaId)?.tipo === 'GASTO')
      .sort((a, b) => b.monto - a.monto)
      .slice(0, 5)
  );

  ultimosMovimientos = computed(() =>
    [...this.movimientosMes()]
      .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id.localeCompare(a.id))
      .slice(0, 5)
  );

  constructor() {
    this.categoriaService.listar().subscribe((res) => this.categorias.set(res));
    this.movimientoService.listar({ tamanio: 10000, sort: 'fecha,desc' }).subscribe((res) => this.movimientos.set(res.contenido));
  }

  private calcularSaldo(lista: Movimiento[]) {
    let total = 0;
    for (const m of lista) {
      const cat = this.categoriaMap().get(m.categoriaId);
      total += cat?.tipo === 'INGRESO' ? m.monto : -m.monto;
    }
    return total;
  }

  protected formatoMoneda = formatoMoneda;
}
