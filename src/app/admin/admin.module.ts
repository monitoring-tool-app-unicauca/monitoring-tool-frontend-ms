import { NgModule } from '@angular/core';
import { CommonModule ,Location, NgClass, PlatformLocation,TitleCasePipe} from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { ChatboxComponent } from './layout/chatbox/chatbox.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SafeHtmlSvgPipe } from '../_services/svg-pipe/safe-html-svg.pipe';
import { RouterLink } from '@angular/router';
import { NavHeaderComponent } from './layout/nav-header/nav-header.component';

import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LightgalleryModule } from 'lightgallery/angular';


@NgModule({
  declarations: [
    AdminLayoutComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    ChatboxComponent,
    NavHeaderComponent,

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
    SafeHtmlSvgPipe
  ]
})
export class AdminModule { }
