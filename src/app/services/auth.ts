import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class Auth {

    private http = inject(HttpClient);

    registrar(data: { nombre: string; email: string; passwordHash: string }) {
        return this.http.post('/auth/register', data);
    }

    login(data: { email: string; password: string }) {
        return this.http.post<{ email: string; nombre: string; token: string }>('/auth/login', data);
    }

}
