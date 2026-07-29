import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

export interface AuthResponse {
  id: string;
  email: string;
  nombre: string;
  moneda: string;
  token: string;
  refresh_token: string;
}

@Service()
export class Auth {

    private http = inject(HttpClient);

    registrar(data: { nombre: string; email: string; passwordHash: string }) {
        return this.http.post<AuthResponse>('/auth/register', data);
    }

    login(data: { email: string; password: string }) {
        return this.http.post<AuthResponse>('/auth/login', data);
    }

    refreshToken(refreshToken: string) {
        return this.http.post<AuthResponse>('/auth/refresh', { refresh_token: refreshToken });
    }

    logout(refreshToken?: string) {
        const body: Record<string, string> = {};
        if (refreshToken) body['refresh_token'] = refreshToken;
        return this.http.post('/auth/logout', body);
    }

}
