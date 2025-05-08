import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from '../shared/layout/shell/shell.component';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,

    data: { layout: 'user' },
    children: [
      // { path:'index', component:AdminIndexComponent},
      // { path: 'add-user', component: AppEditProfileComponent },
      // { path: 'edit-user/:id', component: AppEditProfileComponent },
      // { path: 'employee', component: UsersComponent },
      // { path: 'user-roles', component: AppUserRolesComponent },
      // { path: 'add-role', component: AppAddRoleComponent },

      // { path: 'projects',component: ProjectsPageComponent},
      // { path: 'projects/overview',component: ProjectOverviewHeadComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitoringRoutingModule { }
