import { Component } from '@angular/core';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
@Component({
  selector: 'app-app-add-role',
  templateUrl: './app-add-role.component.html',
  styleUrl: './app-add-role.component.css'
})
export class AppAddRoleComponent {
  breadcrumbList = {
    title: 'Dashboard',
    breadcrumb_path: 'Apps',
    currentURL: 'Add Roles',
  }
}
