import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Estadisticas } from './pages/estadisticas/estadisticas';
import { Movimientos } from './pages/movimientos/movimientos';
import { Categorias } from './pages/categorias/categorias';
import { MetodosPago } from './pages/metodos-pago/metodos-pago';
import { Configuracion } from './pages/configuracion/configuracion';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', component: Landing, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  {
    path: 'app',
    component: MainLayout,
    canActivateChild: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'estadisticas', component: Estadisticas },
      { path: 'movimientos', component: Movimientos },
      { path: 'categorias', component: Categorias },
      { path: 'metodos-pago', component: MetodosPago },
      { path: 'configuracion', component: Configuracion },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
