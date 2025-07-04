import { NgModule, importProvidersFrom } from '@angular/core';
import { CommonModule ,Location, NgClass, PlatformLocation,TitleCasePipe} from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
// import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
// import { FooterComponent } from './layout/footer/footer.component';
// import { HeaderComponent } from './layout/header/header.component';
// import { SidebarComponent } from './layout/sidebar/sidebar.component';
// import { ChatboxComponent } from './layout/chatbox/chatbox.component';
// import { NavHeaderComponent } from './layout/nav-header/nav-header.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SafeHtmlSvgPipe } from '../_services/svg-pipe/safe-html-svg.pipe';
import { RouterLink } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LightgalleryModule } from 'lightgallery/angular';
import { AdminIndexComponent } from './components/index/admin-index/admin-index.component';
import { AppAddRoleComponent } from './pages/users-manager/app-add-role/app-add-role.component';
import { AppEditProfileComponent } from './pages/users-manager/app-edit-profile/app-edit-profile.component';


import { AppUserRolesComponent } from './pages/users-manager/app-user-roles/app-user-roles.component';

import { ProfileHeadComponent } from './components/user-manager/profile-head/profile-head.component';
import { ProfileSidMenuComponent } from './components/user-manager/profile-sid-menu/profile-sid-menu.component';

import { MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ToastrModule } from 'ngx-toastr';


import { ProfileTabComponent } from './components/user-manager/profile-tab/profile-tab.component';
import { UsersComponent } from './components/users/users.component';
import { UsersListComponent } from './components/users/users-list/users-list.component';



@NgModule({
  declarations: [
    AdminIndexComponent,
    AppAddRoleComponent,
    AppEditProfileComponent,

    AppUserRolesComponent,
    ProfileHeadComponent,
    ProfileSidMenuComponent,
    ProfileTabComponent,
    UsersComponent,
    UsersListComponent,

  ],
  imports: [
    CommonModule,
    NgClass,

    AdminRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,

    RouterLink,

    TitleCasePipe,
    SafeHtmlSvgPipe,

    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatTableModule,
    MatIconModule,

    LightgalleryModule,



  ],
  providers:[
    importProvidersFrom(
      ToastrModule.forRoot(),
    )

  ]
})
export class AdminModule { }
