import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { HealthService } from '../../services/health/health.service';
import { Sort } from '@angular/material/sort';
import { EndpointResponseDTO } from '../../interfaces/Endpoint.ResponseDTO';
import { EndpointDTO } from '../../interfaces/EndpointDTO';
import { Subscription } from 'rxjs';
import { HealthEndpointLineChartComponent } from '../healthendpoint-line-chart/health-endpoint-line-chart/health-endpoint-line-chart.component';



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
  @Output() selectTab : EventEmitter<string> = new EventEmitter();
  @ViewChild(HealthEndpointLineChartComponent)
  healthEndpointChartComponent!: HealthEndpointLineChartComponent;

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

  selectedEndpoint: any = {};
  endpointChartVisible: boolean = false;

  endpoints: EndpointResponseDTO[] = [];
  orderData: EndpointResponseDTO[] = [];

  private sseSubscription: Subscription | null = null;

  constructor(private healthService: HealthService,private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    const projectId = this.project.projectId;
    if (!this.sseSubscription) {
      this.connectToSSE(projectId);
    }

  }
  ngOnDestroy(): void {
    // Asegurarse de cerrar la conexión SSE cuando el componente se destruya
    if (this.sseSubscription) {
      this.sseSubscription.unsubscribe(); // Usamos unsubscribe para cerrar la suscripción
      this.sseSubscription = null;
    }
  }
  private connectToSSE(projectId: string): void {
    this.sseSubscription = this.healthService.getHealthEndpointsByProject(projectId).subscribe({
      next: (data: EndpointResponseDTO[]) => {
        // Itera sobre los nuevos datos de los endpoints
        data.forEach((newEndpoint: EndpointResponseDTO) => {
          // Encuentra el endpoint correspondiente en el arreglo actual
          const existingEndpoint = this.endpoints.find(ep => ep.id === newEndpoint.id);

          // Si existe, actualiza solo sus valores
          if (existingEndpoint) {
            existingEndpoint.status = newEndpoint.status;
            existingEndpoint.lastCheckedAt = newEndpoint.lastCheckedAt;
            existingEndpoint.nextCheckedAt = newEndpoint.nextCheckedAt;
            existingEndpoint.responseTimeMs = newEndpoint.responseTimeMs;
          } else {
            // Si no existe, agrega el endpoint a la lista
            this.endpoints.push(newEndpoint);
          }
        });

        // Después de actualizar, realiza la paginación
        this.orderData = [...this.endpoints];
        this.allData = this.paginator(this.orderData, this.page, this.totalRows);
        this.totalPage = this.allData.total_pages;

        // Actualiza la vista
        this.cdRef.detectChanges();

        // Si hay un endpoint seleccionado, actualízalo en el gráfico
        if (this.selectedEndpoint && this.healthEndpointChartComponent) {
          const updatedEndpoint = data.find(ep => ep.id === this.selectedEndpoint.id);
          if (updatedEndpoint) {
            this.selectedEndpoint = updatedEndpoint; // Actualiza la información del seleccionado
            this.healthEndpointChartComponent.addPoint(new Date(), updatedEndpoint.responseTimeMs);
          }
        }
      },
      error: (err) => {
        console.error('Error receiving SSE data:', err);
      }
    });
  }




  viewEndpointChart(endpoint: any) {

    if (this.selectedEndpoint === endpoint) {

      this.endpointChartVisible = !this.endpointChartVisible;
    } else {

      this.selectedEndpoint = endpoint;
      this.endpointChartVisible = true;
    }
  }
  editEndpoint(endpoint: EndpointDTO) {
    this.healthService.setEndpointToEdit(endpoint);
    this.selectTab.emit('createEndpoint');
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
