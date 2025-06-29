
import { Component } from '@angular/core';
import { Breadcrumb } from '../../../../shared/interfaces/Breadcrum.interface';

@Component({
  selector: 'app-admin-index',
  templateUrl: './admin-index.component.html',
  styleUrl: './admin-index.component.css'
})
export class AdminIndexComponent {

  breadcrumbList: Breadcrumb = {
    title: 'User',
    subTitle: 'Dashboard',
    items: [
      { label: 'Home', url: '/admin/index' },
      { label: 'Dashboard' },
      
    ]
  };

}
