import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Auth } from './services/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [RouterOutlet]
})
export class App {
  private auth = inject(Auth);

  constructor() {
    const token = localStorage.getItem('token');
    if (token) {
      this.auth.verificarToken(token).subscribe(res => {
        if (res.expirado) {
          this.auth.limpiarSesion();
        }
      });
    }
  }
}
