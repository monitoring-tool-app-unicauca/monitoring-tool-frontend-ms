import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './elements/admin-layout/admin-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { CoreHrComponent } from './pages/core-hr/core-hr.component';
import { TaskComponent } from './pages/task/task/task.component';
import { TaskSummaryComponent } from './pages/task/task-summary/task-summary.component';
import { PerformanceComponent } from './pages/performance/performance.component';
import { ProjectComponent } from './pages/project/project.component';
import { ProfileOverviewComponent } from './pages/profile-pages/profile-overview/profile-overview.component';
import { ProfileProjectsDetailsComponent } from './pages/profile-pages/profile-projects-details/profile-projects-details.component';
import { ProfileProjectsComponent } from './pages/profile-pages/profile-projects/profile-projects.component';
import { AccountLogsComponent } from './pages/account-pages/account-logs/account-logs.component';
import { AccountOverviewComponent } from './pages/account-pages/account-overview/account-overview.component';

import { AccountSettingsComponent } from './pages/account-pages/account-settings/account-settings.component';
import { PostDetailsComponent } from './pages/apps/users-manager/post-details/post-details.component';
import { AreaComponent } from './plugins/charts/apex/area/area.component';
import { BarComponent } from './plugins/charts/apex/bar/bar.component';
import { BubbleComponent } from './plugins/charts/apex/bubble/bubble.component';
import { CandlestickComponent } from './plugins/charts/apex/candlestick/candlestick.component';
import { ColumnComponent } from './plugins/charts/apex/column/column.component';
import { HeatmapComponent } from './plugins/charts/apex/heatmap/heatmap.component';
import { LineComponent } from './plugins/charts/apex/line/line.component';
import { MixedComponent } from './plugins/charts/apex/mixed/mixed.component';
import { PieComponent } from './plugins/charts/apex/pie/pie.component';
import { PolarAreaComponent } from './plugins/charts/apex/polar-area/polar-area.component';
import { RadarComponent } from './plugins/charts/apex/radar/radar.component';
import { RadialbarComponent } from './plugins/charts/apex/radialbar/radialbar.component';
import { ScatterComponent } from './plugins/charts/apex/scatter/scatter.component';
import { SparklinesComponent } from './plugins/charts/apex/sparklines/sparklines.component';
import { TimelineComponent } from './plugins/charts/apex/timeline/timeline.component';
import { TreemapComponent } from './plugins/charts/apex/treemap/treemap.component';
import { AnimationChartjsComponent } from './plugins/charts/chart-js/animation-chartjs/animation-chartjs.component';
import { AreaChartjsComponent } from './plugins/charts/chart-js/area-chartjs/area-chartjs.component';
import { BarChartjsComponent } from './plugins/charts/chart-js/bar-chartjs/bar-chartjs.component';
import { BubbleChartjsComponent } from './plugins/charts/chart-js/bubble-chartjs/bubble-chartjs.component';
import { GeneralChartjsComponent } from './plugins/charts/chart-js/general-chartjs/general-chartjs.component';
import { LineChartjsComponent } from './plugins/charts/chart-js/line-chartjs/line-chartjs.component';

import { LightGalleryComponent } from './plugins/light-gallery/light-gallery.component';


import { EmptyComponent } from './pages/error/empty/empty.component';
import { ForgotPasswordComponent } from './pages/authentication/forgot-password/forgot-password.component';
import { LockScreenComponent } from './pages/authentication/lock-screen/lock-screen.component';
import { LoginComponent } from './pages/authentication/login/login.component';
import { RegisterComponent } from './pages/authentication/register/register.component';
import { Error400Component } from './pages/error/error400/error400.component';
import { Error403Component } from './pages/error/error403/error403.component';
import { Error404Component } from './pages/error/error404/error404.component';
import { Error500Component } from './pages/error/error500/error500.component';
import { Error503Component } from './pages/error/error503/error503.component';
import { AppUserComponent } from './pages/apps/users-manager/app-user/app-user.component';
import { AppEditProfileComponent } from './pages/apps/users-manager/app-edit-profile/app-edit-profile.component';
import { AppUserRolesComponent } from './pages/apps/users-manager/app-user-roles/app-user-roles.component';
import { AppAddRoleComponent } from './pages/apps/users-manager/app-add-role/app-add-role.component';
import { AppProfile1Component } from './pages/apps/users-manager/app-profile-1/app-profile-1.component';


export const routes: Routes = [
  { path: '', redirectTo: '/admin', pathMatch: 'full' },
  {
    path: 'admin', component: AdminLayoutComponent, children: [
      { path: '', component: DashboardComponent },
      { path: 'index', component: DashboardComponent },
      { path: 'index-2', component: DashboardComponent },
      { path: 'employee', component: EmployeesComponent },
      { path: 'core-hr', component: CoreHrComponent },
      { path: 'task', component: TaskComponent },
      { path: 'task-summary', component: TaskSummaryComponent },
      { path: 'performance', component: PerformanceComponent },
      { path: 'project', component: ProjectComponent },

      // Profile pages
      { path: 'profile/overview', component: ProfileOverviewComponent },
      { path: 'profile/projects', component: ProfileProjectsComponent },
      { path: 'profile/projects-details', component: ProfileProjectsDetailsComponent },
        // Account pages
      { path: 'account/overview', component: AccountOverviewComponent },
      { path: 'account/settings', component: AccountSettingsComponent },
      { path: 'account/logs', component: AccountLogsComponent },
      // Apps
        //Users Manager
        { path: 'app-profile', component: AppProfile1Component },
        { path: 'post-details', component: PostDetailsComponent },
        { path: 'user', component: AppUserComponent },
        { path: 'add-user', component: AppEditProfileComponent },
        { path: 'edit-profile', component: AppEditProfileComponent },
        { path: 'user-roles', component: AppUserRolesComponent },
        { path: 'add-role', component: AppAddRoleComponent },
        { path: 'app-profile-1', component: AppProfile1Component },

        // Users Manager

      // Apps- shop
      // Aikit pages
      // CMS --
      // Chart
      { path: 'apex-area', component: AreaComponent },
      { path: 'apex-bar', component: BarComponent },
      { path: 'apex-bubble', component: BubbleComponent },
      { path: 'apex-candlestick', component: CandlestickComponent },
      { path: 'apex-column', component: ColumnComponent },
      { path: 'apex-heatmap', component: HeatmapComponent },
      { path: 'apex-line', component: LineComponent },
      { path: 'apex-mixed', component: MixedComponent },
      { path: 'apex-pie', component: PieComponent },
      { path: 'apex-polar-area', component: PolarAreaComponent },
      { path: 'apex-radar', component: RadarComponent },
      { path: 'apex-radialbar', component: RadialbarComponent },
      { path: 'apex-scatter', component: ScatterComponent },
      { path: 'apex-sparklines', component: SparklinesComponent },
      { path: 'apex-timeline', component: TimelineComponent },
      { path: 'apex-treemap', component: TreemapComponent },

      { path: 'chartjs-general', component: GeneralChartjsComponent },
      { path: 'chartjs-bar', component: BarChartjsComponent },
      { path: 'chartjs-line', component: LineChartjsComponent },
      { path: 'chartjs-area', component: AreaChartjsComponent },
      { path: 'chartjs-bubble', component: BubbleChartjsComponent },
      { path: 'chartjs-animation', component: AnimationChartjsComponent },

      // plugins --
      { path: 'uc-light-gallery', component: LightGalleryComponent },

      // widget --

      // Forms

      { path: 'empty-page', component: EmptyComponent },
    ]
  },
  { path: 'page-register', component: RegisterComponent },
  { path: 'page-login', component: LoginComponent },
  { path: 'page-forgot-password', component: ForgotPasswordComponent },
  { path: 'page-error-400', component: Error400Component },
  { path: 'page-error-403', component: Error403Component },
  { path: 'page-error-404', component: Error404Component },
  { path: 'page-error-500', component: Error500Component },
  { path: 'page-error-503', component: Error503Component },
  { path: 'page-lock-screen', component: LockScreenComponent },
  { path: '**', component: Error404Component },
]
