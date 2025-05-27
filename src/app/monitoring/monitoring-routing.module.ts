import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from '../shared/layout/shell/shell.component';
import { UsersComponent } from '../admin/components/users/users.component';
import { AppUserRolesComponent } from '../admin/pages/users-manager/app-user-roles/app-user-roles.component';
import { ProjectsPageComponent } from './pages/projects/projects-page/projects-page.component';
import { ProjectOverviewHeadComponent } from './components/project-overview-head/project-overview-head.component';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,

    data: { layout: 'user' },
    children: [
      // { path:'index', component:AdminIndexComponent},
      

      { path: 'employee', component: UsersComponent },
      { path: 'user-roles', component: AppUserRolesComponent },


      { path: 'projects',component: ProjectsPageComponent},
      { path: 'projects/overview',component: ProjectOverviewHeadComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitoringRoutingModule { }
