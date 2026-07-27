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
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
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
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
