import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

export interface Categoria {
  id: string;
  nombre: string;
  tipo: 'INGRESO' | 'GASTO';
  usuarioId: string;
}

@Service()
export class CategoriaService {
  private http = inject(HttpClient);

  listar() {
    return this.http.get<Categoria[]>('/categoria');
  }

  obtener(id: string) {
    return this.http.get<Categoria>(`/categoria/${id}`);
  }

  crear(data: { nombre: string; tipo: string }) {
    return this.http.post<Categoria>('/categoria', data);
  }

  actualizar(id: string, data: { nombre: string; tipo: string }) {
    return this.http.put<Categoria>(`/categoria/${id}`, data);
  }

  eliminar(id: string) {
    return this.http.delete(`/categoria/${id}`);
  }
}
