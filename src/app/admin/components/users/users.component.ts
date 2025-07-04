import { Component, OnInit } from '@angular/core';
import { Breadcrumb } from '../../../shared/interfaces/Breadcrum.interface';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  
  breadcrumbList!: Breadcrumb 

  ngOnInit(){
    this.breadcrumbList= {
      title: 'User',
      subTitle: '',
      items: [
        { label: 'Home', url: '/admin/index' },
        { label:  'User Listing' }
      ]
    };
  }


}
