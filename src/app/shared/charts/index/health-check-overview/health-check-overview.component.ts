import { Component, Input, SimpleChanges } from '@angular/core';

import {
  ApexAxisChartSeries, ApexChart, ApexXAxis, ApexStroke, ApexLegend,
  ApexTooltip, ApexFill
} from 'ng-apexcharts';
import { HealthService } from '../../../../monitoring/services/health/health.service';


// export type ChartOptions = {
//   series: ApexAxisChartSeries;
//   chart: ApexChart;
//   xaxis: ApexXAxis;
//   stroke: ApexStroke;
//   dataLabels: ApexDataLabels;
//   markers: ApexMarkers;
//   yaxis: ApexYAxis;
//   tooltip: ApexTooltip;
//   legend: ApexLegend;
//   plotOptions: ApexPlotOptions;
//   fill: ApexFill;
//   grid: ApexGrid;
//   colors: string[];
//   labels: string[];
// };
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  fill: ApexFill;
  colors: string[];
};
@Component({
  selector: 'app-health-check-overview',
  
  templateUrl: './health-check-overview.component.html',
  styleUrl: './health-check-overview.component.css'
})
export class HealthCheckOverviewComponent {
  @Input() summary:any
  chartOptions: ChartOptions | null = null;

  selectedHealthId: number | null = null;

  availableEndpoints:any[]=[]
  

  constructor(
    private healthService: HealthService) {}

ngOnInit(): void {
    console.log("Summary ", this.summary);

    const allEndpoints: any[] = [];

    if (Array.isArray(this.summary)) {
      for (const project of this.summary) {
        const endpoints = project.availabeEndpoints || [];
        for (const endpoint of endpoints) {
          allEndpoints.push(endpoint);
        }
      }
    }

    // Quitar duplicados por id
    const unique = new Map<number, any>();
    for (const ep of allEndpoints) {
      if (!unique.has(ep.id)) unique.set(ep.id, ep);
    }

    this.availableEndpoints = Array.from(unique.values());

    if (this.availableEndpoints.length > 0) {
      this.selectedHealthId = this.availableEndpoints[0].id;
      this.fetchChartData(this.selectedHealthId);
    }
}



  onHealthIdChange(event: any): void {
    this.fetchChartData(this.selectedHealthId);
  }

  fetchChartData(healthId: number | null): void {
    if (!healthId) return;

    this.healthService.getHealthCheckByEndpointId(healthId).subscribe((response) => {
    const data = response.data || []; 

    const times = data.map((d: { responseTimeMs: any; }) => d.responseTimeMs);
    const labels = data.map((d: { checkedAt: string | number | Date; }) => {
      try {
        return new Date(d.checkedAt).toLocaleString('es-CO', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          day: '2-digit',
          month: 'short'
        });
      } catch (e) {
        return 'Fecha inválida';
      }
    });

    this.chartOptions = {
      series: [
        {
          name: 'Response Times (ms)',
          data: times,
          type: 'area'
        }
      ],
      chart: {
        height: 300,
        type: 'area',
        zoom: { enabled: false }
      },
      colors: ['#1E90FF'],
      stroke: {
        curve: 'smooth',
        width: 3
      },
      legend: {
        show: true,
        fontSize: '13px'
      },
      xaxis: {
        categories: labels,
        labels: {
          style: {
            fontSize: '12px'
          }
        }
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val} ms`
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          opacityFrom: 0.9,
          opacityTo: 0.6
        }
      }
    };
  });

  }
}
