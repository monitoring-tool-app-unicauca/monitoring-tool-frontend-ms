import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { AdminGuard } from './guards/admin.guard';
import { AdminIndexComponent } from './components/index/admin-index/admin-index.component';
import { AppEditProfileComponent } from './pages/users-manager/app-edit-profile/app-edit-profile.component';
import { UsersComponent } from './components/users/users.component';
import { AppAddRoleComponent } from './pages/users-manager/app-add-role/app-add-role.component';
import { AppUserRolesComponent } from './pages/users-manager/app-user-roles/app-user-roles.component';
import { ProjectsPageComponent } from '../monitoring/pages/projects/projects-page/projects-page.component';


const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    /* canActivate: [AdminGuard], */
    children: [
      { path:'index', component:AdminIndexComponent},
      { path: 'add-user', component: AppEditProfileComponent },
      { path: 'edit-user/:id', component: AppEditProfileComponent },
      { path: 'employee', component: UsersComponent },
      { path: 'user-roles', component: AppUserRolesComponent },
      { path: 'add-role', component: AppAddRoleComponent },

      { path: 'add-project',component: ProjectsPageComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
