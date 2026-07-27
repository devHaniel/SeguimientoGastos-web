import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
})
export class MainLayout {
  private router = inject(Router);
  showMenu = signal(false);
  nombre = localStorage.getItem('nombre') || 'Usuario';

  toggleMenu() {
    this.showMenu.update((v) => !v);
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
