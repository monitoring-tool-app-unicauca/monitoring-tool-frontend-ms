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
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

import { ShellComponent } from './layout/shell/shell.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { ChatboxComponent } from './layout/chatbox/chatbox.component';
import { NavHeaderComponent } from './layout/nav-header/nav-header.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SafeHtmlSvgPipe } from '../_services/svg-pipe/safe-html-svg.pipe';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BarChartApexComponent } from './charts/chart-config/bar-chart-apex/bar-chart-apex.component';
import { IndexComponent } from './pages/index/index/index.component';


import { ProjectsOverviewComponent } from '../shared/charts/index/projects-overview/projects-overview.component';
import { HealthCheckOverviewComponent } from './charts/index/health-check-overview/health-check-overview.component';
// import {
//   ApexAxisChartSeries,
//   ApexChart,
//   ApexXAxis,
//   ApexDataLabels,
//   ApexStroke,
//   ApexMarkers,
//   ApexYAxis,
//   ApexTooltip,
//   ApexLegend,
//   ApexPlotOptions,
//   ApexFill,
//   ApexGrid,
// } from 'ng-apexcharts';
import { DownsGraphComponent } from './charts/index/downs-graph/downs-graph.component';


@NgModule({
  declarations: [
    DropdownComponent,
    PaginationComponent,
    BreadcrumbComponent,
    Select2Component,
    Error503Component,
    Error500Component,
    Error404Component,
    Error403Component,
    Error400Component,
    EmptyComponent,

    ShellComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    ChatboxComponent,
    NavHeaderComponent,

    BarChartApexComponent,
    IndexComponent,

    ProjectsOverviewComponent,
    HealthCheckOverviewComponent,
    DownsGraphComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    Select2Module,
    RouterLink,

    SafeHtmlSvgPipe,
    NgbModule,

    NgApexchartsModule,
        

  ],
  exports: [
    DropdownComponent,
    PaginationComponent,
    BreadcrumbComponent,
    Select2Component,
    Error503Component,
    Error500Component,
    Error404Component,
    Error403Component,
    Error400Component,
    EmptyComponent,

    ShellComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    ChatboxComponent,
    NavHeaderComponent,

    BarChartApexComponent,
    IndexComponent,
  ]
})
export class SharedModule { }
