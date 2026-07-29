import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map } from 'rxjs';

export interface Movimiento {
  id: string;
  monto: number;
  fecha: string;
  descripcion: string;
  categoriaId: string;
  metodoPagoId: string;
  usuarioId: string;
}

export interface MovimientoFilter {
  pagina?: number;
  tamanio?: number;
  sort?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  categoriaId?: string;
  metodoPagoId?: string;
  tipo?: 'INGRESO' | 'GASTO';
  q?: string;
}

export interface PaginatedResponse<T> {
  contenido: T[];
  pagina: number;
  tamanio: number;
  totalElementos: number;
  totalPaginas: number;
  ultima: boolean;
}

@Service()
export class MovimientoService {
  private http = inject(HttpClient);

  listar(filtro?: MovimientoFilter) {
    let params = new HttpParams();
    if (filtro) {
      if (filtro.pagina !== undefined) params = params.set('pagina', filtro.pagina);
      if (filtro.tamanio !== undefined) params = params.set('tamanio', filtro.tamanio);
      if (filtro.sort) params = params.set('sort', filtro.sort);
      if (filtro.fechaDesde) params = params.set('fechaDesde', filtro.fechaDesde);
      if (filtro.fechaHasta) params = params.set('fechaHasta', filtro.fechaHasta);
      if (filtro.categoriaId) params = params.set('categoriaId', filtro.categoriaId);
      if (filtro.metodoPagoId) params = params.set('metodoPagoId', filtro.metodoPagoId);
      if (filtro.tipo) params = params.set('tipo', filtro.tipo);
      if (filtro.q) params = params.set('q', filtro.q);
    }
    return this.http.get<Movimiento[] | PaginatedResponse<Movimiento>>('/movimiento', { params }).pipe(
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

  obtener(id: string) {
    return this.http.get<Movimiento>(`/movimiento/${id}`);
  }

  crear(data: { monto: number; fecha: string; descripcion: string; categoriaId: string; metodoPagoId: string }) {
    return this.http.post<Movimiento>('/movimiento', data);
  }

  actualizar(id: string, data: { monto: number; fecha: string; descripcion: string; categoriaId: string; metodoPagoId: string }) {
    return this.http.put<Movimiento>(`/movimiento/${id}`, data);
  }

  eliminar(id: string) {
    return this.http.delete(`/movimiento/${id}`);
  }
}
