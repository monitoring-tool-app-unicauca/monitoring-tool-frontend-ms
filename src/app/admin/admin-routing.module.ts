import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { AdminGuard } from './guards/admin.guard';
import { AdminIndexComponent } from './components/index/admin-index/admin-index.component';
import { AppEditProfileComponent } from './pages/users-manager/app-edit-profile/app-edit-profile.component';


const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    /* canActivate: [AdminGuard], */
    children: [
      {path:'index', component:AdminIndexComponent},
      { path: 'add-user', component: AppEditProfileComponent },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
