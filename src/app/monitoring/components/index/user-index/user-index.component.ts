import { Component } from '@angular/core';
import { Breadcrumb } from '../../../../shared/interfaces/Breadcrum.interface';

@Component({
  selector: 'app-user-index',
  templateUrl: './user-index.component.html',
  styleUrl: './user-index.component.css'
})
export class UserIndexComponent {

   breadcrumbList: Breadcrumb = {
      title: 'User',
      subTitle: 'Dashboard',
      items: [
        { label: 'Home', url: '/admin/index' },
        { label: 'Dashboard' },
        
      ]
    };
}
