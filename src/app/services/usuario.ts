import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  moneda: string;
}

@Service()
export class UsuarioService {
  private http = inject(HttpClient);

  obtener() {
    return this.http.get<Usuario>('/usuario');
  }

  actualizar(data: Partial<{ email: string; nombre: string; moneda: string }>) {
    return this.http.put<Usuario>('/usuario', data);
  }
}
