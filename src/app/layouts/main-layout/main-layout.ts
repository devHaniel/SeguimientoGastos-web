import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { finalize } from 'rxjs';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
})
export class MainLayout {
  private router = inject(Router);
  private auth = inject(Auth);
  showMenu = signal(false);
  sidebarOpen = signal(false);
  nombre = localStorage.getItem('nombre') || 'Usuario';

  toggleMenu() {
    this.showMenu.update((v) => !v);
  }

  toggleSidebar() {
    this.sidebarOpen.update((v) => !v);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }

  cerrarSesion() {
    const refreshToken = localStorage.getItem('refresh_token') || undefined;
    this.auth.logout(refreshToken).pipe(
      finalize(() => {
        localStorage.clear();
        this.router.navigate(['/login']);
      })
    ).subscribe();
  }
}
