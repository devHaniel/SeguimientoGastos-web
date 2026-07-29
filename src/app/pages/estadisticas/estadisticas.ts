import { Component, computed, inject, signal } from '@angular/core';
import { EstadisticaService, Resumen, ResumenPorMetodo } from '../../services/estadistica';
import { formatoMoneda } from '../../utils/moneda';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.html',
})
export class Estadisticas {
  private service = inject(EstadisticaService);

  periodos = [
    { key: 'HOY', label: 'Hoy' },
    { key: 'SEMANA', label: 'Esta semana' },
    { key: 'MES', label: 'Este mes' },
    { key: 'ANIO', label: 'Este año' },
  ];
  periodoActivo = signal('MES');
  loading = signal(false);

  data = signal<Resumen | null>(null);

  totalIngresos = computed(() => this.data()?.totalIngresos ?? 0);
  totalGastos = computed(() => this.data()?.totalGastos ?? 0);
  saldo = computed(() => this.totalIngresos() - this.totalGastos());
  porMetodo = computed(() => this.data()?.porMetodoPago ?? []);

  granTotal = computed(() => this.totalIngresos() + this.totalGastos());

  coordenadasDonut = computed(() => {
    const items = this.porMetodo();
    const total = items.reduce((s, i) => s + i.ingresos + i.gastos, 0);
    if (total === 0) return [];
    const cx = 120, cy = 120, r = 90, ancho = 30;
    let acum = 0;
    const colores: Record<string, string> = {
      EFECTIVO: '#9ca3af',
      TARJETA_DEBITO: '#60a5fa',
      TARJETA_CREDITO: '#fb923c',
    };
    return items.map((item) => {
      const valor = item.ingresos + item.gastos;
      const fraccion = valor / total;
      const angulo = fraccion * 360;
      const inicio = acum;
      acum += angulo;
      return this.dibujarArco(cx, cy, r, ancho, inicio, acum, colores[item.metodoPagoTipo] || '#d1d5db', item.metodoPagoNombre, fraccion);
    });
  });

  private dibujarArco(
    cx: number,
    cy: number,
    r: number,
    ancho: number,
    inicio: number,
    fin: number,
    color: string,
    label: string,
    fraccion: number
  ) {
    const rInt = r - ancho / 2;
    const a1 = (inicio - 90) * (Math.PI / 180);
    const a2 = (fin - 90) * (Math.PI / 180);
    const x1 = cx + rInt * Math.cos(a1);
    const y1 = cy + rInt * Math.sin(a1);
    const x2 = cx + rInt * Math.cos(a2);
    const y2 = cy + rInt * Math.sin(a2);
    const largeArc = fin - inicio > 180 ? 1 : 0;
    const path = `M ${x1} ${y1} A ${rInt} ${rInt} 0 ${largeArc} 1 ${x2} ${y2}`;
    return { path, color, label, fraccion };
  }

  constructor() {
    this.cargar();
  }

  seleccionarPeriodo(key: string) {
    this.periodoActivo.set(key);
    this.cargar();
  }

  private cargar() {
    this.loading.set(true);
    this.service.resumen({ periodo: this.periodoActivo() }).subscribe({
      next: (res) => {
        console.log('Estadísticas response', res);
        this.data.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al carrar estadísticas', err);
        this.loading.set(false);
      },
    });
  }

  protected formatoMoneda = formatoMoneda;

  maxPorMetodo = computed(() => {
    const items = this.porMetodo();
    if (items.length === 0) return 0;
    return Math.max(...items.map((i) => i.ingresos + i.gastos), 1);
  });
}
