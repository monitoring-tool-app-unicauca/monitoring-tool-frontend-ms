import { Component, Input } from '@angular/core';
import { Breadcrumb } from '../../interfaces/Breadcrum.interface';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent {

  @Input() breadcrumb: Breadcrumb = {};
  @Input() style2?: boolean = false;

  title: string = 'Dashboard';
  subTitle: string = 'Monitoring Tool dashboard';
  currentURL?: string = '';
  breadcrumb_path?: string = '';
  offcanvasExample: boolean = false;

  ngOnInit() {

    // this.title = this.breadcrumb.title || this.title;
    // this.subTitle = this.breadcrumb.subTitle || this.subTitle;
    // this.breadcrumb_path = this.breadcrumb.breadcrumb_path;
    // this.currentURL = this.breadcrumb.currentURL;
    if (!this.breadcrumb || !this.breadcrumb.items || !this.breadcrumb.title) {
      console.warn('breadcrumb no está completamente definido');
    }
  }

  toggleExample() {
    this.offcanvasExample = !this.offcanvasExample;
  }

}
