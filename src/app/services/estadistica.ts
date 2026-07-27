import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';

export interface ResumenPorMetodo {
  metodoPagoId: string;
  metodoPagoNombre: string;
  metodoPagoTipo: 'EFECTIVO' | 'TARJETA_DEBITO' | 'TARJETA_CREDITO';
  ingresos: number;
  gastos: number;
}

export interface Resumen {
  totalIngresos: number;
  totalGastos: number;
  porMetodoPago: ResumenPorMetodo[];
}

@Service()
export class EstadisticaService {
  private http = inject(HttpClient);

  resumen(params: { periodo?: string; fechaInicio?: string; fechaFin?: string }) {
    let httpParams = new HttpParams();
    if (params.periodo) httpParams = httpParams.set('periodo', params.periodo);
    if (params.fechaInicio) httpParams = httpParams.set('fechaInicio', params.fechaInicio);
    if (params.fechaFin) httpParams = httpParams.set('fechaFin', params.fechaFin);
    return this.http.get<Resumen>('/estadisticas/resumen', { params: httpParams });
  }
}
