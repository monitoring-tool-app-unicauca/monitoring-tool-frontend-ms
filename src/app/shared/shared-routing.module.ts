import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Error503Component } from './pages/error/error503/error503.component';
import { Error500Component } from './pages/error/error500/error500.component';
import { Error404Component } from './pages/error/error404/error404.component';
import { Error403Component } from './pages/error/error403/error403.component';
import { Error400Component } from './pages/error/error400/error400.component';
import { EmptyComponent } from './pages/error/empty/empty.component';

const routes: Routes = [
  { path: 'page-error-400', component: Error400Component },
  { path: 'page-error-403', component: Error403Component },
  { path: 'page-error-404', component: Error404Component },
  { path: 'page-error-500', component: Error500Component },
  { path: 'page-error-503', component: Error503Component },
  { path: '**', component: Error404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }
