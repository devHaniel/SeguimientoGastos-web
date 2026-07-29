import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map } from 'rxjs';
import { Movimiento, PaginatedResponse } from './movimiento';

export interface MetodoPago {
  id: string;
  nombre: string;
  tipo: 'EFECTIVO' | 'TARJETA_DEBITO' | 'TARJETA_CREDITO';
  usuarioId: string;
}

@Service()
export class MetodoPagoService {
  private http = inject(HttpClient);

  listar() {
    return this.http.get<MetodoPago[]>('/metodo-pago');
  }

  obtener(id: string) {
    return this.http.get<MetodoPago>(`/metodo-pago/${id}`);
  }

  crear(data: { nombre: string; tipo: string }) {
    return this.http.post<MetodoPago>('/metodo-pago', data);
  }

  actualizar(id: string, data: { nombre: string; tipo: string }) {
    return this.http.put<MetodoPago>(`/metodo-pago/${id}`, data);
  }

  eliminar(id: string) {
    return this.http.delete(`/metodo-pago/${id}`);
  }

  movimientos(id: string, filtro?: { pagina?: number; tamanio?: number; sort?: string }) {
    let params = new HttpParams();
    if (filtro) {
      if (filtro.pagina !== undefined) params = params.set('pagina', filtro.pagina);
      if (filtro.tamanio !== undefined) params = params.set('tamanio', filtro.tamanio);
      if (filtro.sort) params = params.set('sort', filtro.sort);
    }
    return this.http.get<Movimiento[] | PaginatedResponse<Movimiento>>(`/metodo-pago/${id}/movimientos`, { params }).pipe(
      map((res) => {
        if (Array.isArray(res)) {
          const pagina = filtro?.pagina ?? 0;
          const tamanio = filtro?.tamanio ?? 10;
          const totalPaginas = Math.ceil(res.length / tamanio) || 1;
          const inicio = pagina * tamanio;
          return {
            contenido: res.slice(inicio, inicio + tamanio),
            pagina,
            tamanio,
            totalElementos: res.length,
            totalPaginas,
            ultima: pagina >= totalPaginas - 1,
          };
        }
        return res;
      })
    );
  }
}
