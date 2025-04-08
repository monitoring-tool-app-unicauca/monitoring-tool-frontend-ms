import { Component } from '@angular/core';

@Component({
  selector: 'app-project-settings',

  templateUrl: './project-settings.component.html',
  styleUrl: './project-settings.component.css'
})
export class ProjectSettingsComponent {
  breadcrumbList = {
    breadcrumb_path: 'Projects',
    currentURL: 'Settings',
  }

  selectStatus = [
    {
      name: 'Please select',
    },
    {
      name: 'India',
    },
    {
      name: 'China',
    },
    {
      name: 'USA',
    }
  ];
}
