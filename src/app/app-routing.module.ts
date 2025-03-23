import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'monitoring',
    loadChildren: () => import('./monitoring/monitoring.module').then(m => m.MonitoringModule)
  }
  //{ path: '', redirectTo: '/admin', pathMatch: 'full' }, // Cambia la redirección
  //{ path: '**', redirectTo: '/auth/login' } // Mantiene la redirección 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
