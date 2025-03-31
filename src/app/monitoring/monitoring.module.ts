import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonitoringRoutingModule } from './monitoring-routing.module';
import { ProjectsPageComponent } from './pages/projects/projects-page/projects-page.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProjectsPageComponent
  ],
  imports: [
    CommonModule,
    MonitoringRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  exports:[
    ProjectsPageComponent
  ]
})
export class MonitoringModule { }
