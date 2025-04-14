import { Component, Input, OnInit } from '@angular/core';
import { HealthService } from '../../services/health/health.service';
import { Sort } from '@angular/material/sort';
import { EndpointResponseDTO } from '../../interfaces/Endpoint.ResponseDTO';



@Component({
  selector: 'app-project-healthendpoints',
  templateUrl: './project-healthendpoints.component.html',
  styleUrls: ['./project-healthendpoints.component.css']
})
export class ProjectHealthendpointsComponent implements OnInit {
  breadcrumbList = {
    breadcrumb_path: 'Project',
    currentURL: 'Healthendpoints & Notifcations',
  };

  dropdown_item = {
    select: 'All Time',
    value: ['All Time', 'Today', 'Weekly', 'Months']
  };

  @Input() project:any;
  active = 1;
  page: any = 1;
  totalRows: number = 7;
  totalPage: any = 0;
  allData: any = [];
  boxActive: Boolean = false;

  contantHead = {
    title: 'Order List',
    desc: 'Lorem ipsum  dolor sit amet',
    title_path: 'Dashboard'
  };

  endpoints: EndpointResponseDTO[] = [];
  orderData: EndpointResponseDTO[] = [];

  constructor(private healthService: HealthService) {}

  ngOnInit(): void {
    const projectId = this.project.projectId;
    this.healthService.getHealthEndpointsByProject(projectId).subscribe({
      next: (data: EndpointResponseDTO[]) => {
        this.endpoints = data;
        this.orderData = [...data];
        this.allData = this.paginator(this.orderData, this.page, this.totalRows);
        this.totalPage = this.allData.total_pages;
      },
      error: (err) => {
        console.error('Error receiving SSE data:', err);
      }
    });
  }

  sortData(sort: Sort) {
    const data = this.endpoints.slice();
    if (!sort.active || sort.direction === '') {
      this.orderData = data;
      return;
    }

    this.orderData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'status': return compare(a.status, b.status, isAsc);
        default: return 0;
      }
    });

    this.allData = this.paginator(this.orderData, this.page, this.totalRows);
  }

  pageChange(e: any) {
    this.page = e;
    this.allData = this.paginator(this.orderData, this.page, this.totalRows);
    this.totalPage = this.allData.total_pages;
  }

  paginator(items: any, current_page: any, per_page_items: any) {
    let page = current_page || 1,
      per_page = per_page_items || 10,
      offset = (page - 1) * per_page,

      paginatedItems = items.slice(offset).slice(0, per_page_items),
      total_pages = Math.ceil(items.length / per_page);

    return {
      page: page,
      per_page: per_page,
      pre_page: page - 1 ? page - 1 : null,
      next_page: (total_pages > page) ? page + 1 : null,
      total: items.length,
      total_pages: total_pages,
      data: paginatedItems
    };
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
