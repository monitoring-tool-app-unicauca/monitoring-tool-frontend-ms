import { Component } from '@angular/core';
import { BreadcrumbComponent } from '../../../../elements/breadcrumb/breadcrumb.component';
import { ProfileHeadComponent } from '../../../../elements/short-cods/apps/profile-head/profile-head.component';
import { ProfileSidMenuComponent } from '../../../../elements/short-cods/apps/profile-sid-menu/profile-sid-menu.component';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css'
})
export class PostDetailsComponent {
  breadcrumbList = {
    breadcrumb_path: 'App',
    currentURL: 'Post Details',
  }
  profileDetailArray = {
    name: 'Mitchell C. Shay',
    email: 'hello@email.com'
  }
}
