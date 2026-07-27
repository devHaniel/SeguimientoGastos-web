import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Movimiento } from './movimiento';

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

  movimientos(id: string) {
    return this.http.get<Movimiento[]>(`/metodo-pago/${id}/movimientos`);
  }
}
