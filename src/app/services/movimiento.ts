import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

export interface Movimiento {
  id: string;
  monto: number;
  fecha: string;
  descripcion: string;
  categoriaId: string;
  metodoPagoId: string;
  usuarioId: string;
}

@Service()
export class MovimientoService {
  private http = inject(HttpClient);

  listar() {
    return this.http.get<Movimiento[]>('/movimiento');
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
