import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { Select2Component } from './components/select2/select2.component';

import { Select2Module, Select2Data } from 'ng-select2-component';
import { RouterLink } from '@angular/router';
import { Error503Component } from './pages/error/error503/error503.component';
import { Error500Component } from './pages/error/error500/error500.component';
import { Error404Component } from './pages/error/error404/error404.component';
import { Error403Component } from './pages/error/error403/error403.component';
import { Error400Component } from './pages/error/error400/error400.component';
import { EmptyComponent } from './pages/error/empty/empty.component';

@NgModule({
  declarations: [
    DropdownComponent,
    PaginationComponent,
    Select2Component,
    Error503Component,
    Error500Component,
    Error404Component,
    Error403Component,
    Error400Component,
    EmptyComponent

  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    Select2Module,
    RouterLink,
  ],
  exports: [
    DropdownComponent,
    PaginationComponent,
    Select2Component,
    Error503Component,
    Error500Component,
    Error404Component,
    Error403Component,
    Error400Component,
    EmptyComponent
  ]
})
export class SharedModule { }
