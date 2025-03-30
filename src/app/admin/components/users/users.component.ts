import { Component } from '@angular/core';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  breadcrumbList = {
    title: 'Users',
    breadcrumb_path: 'Home',
    currentURL: 'users',
  }



}
