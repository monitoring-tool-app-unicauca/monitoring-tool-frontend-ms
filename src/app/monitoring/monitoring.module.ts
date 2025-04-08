import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonitoringRoutingModule } from './monitoring-routing.module';
import { ProjectsPageComponent } from './pages/projects/projects-page/projects-page.component';
import { ProjectOverviewHeadComponent } from './components/project-overview-head/project-overview-head.component';
import { ProjectOverviewComponent } from './components/project-overview/project-overview.component';
import { ProjectSettingsComponent } from './components/project-settings/project-settings.component';

import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    ProjectsPageComponent,
    ProjectOverviewComponent,
    ProjectOverviewHeadComponent,
    ProjectSettingsComponent,

  ],
  imports: [
    CommonModule,
    MonitoringRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,

    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatTableModule,
    MatIconModule,
  ],
  exports:[
    ProjectsPageComponent,
    ProjectOverviewComponent
  ]
})
export class MonitoringModule { }
