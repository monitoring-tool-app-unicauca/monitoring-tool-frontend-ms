import { Component, Input, SimpleChanges } from '@angular/core';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexTooltip,
  ApexLegend,
  ApexPlotOptions,
  ApexFill,
  ApexGrid,
  NgApexchartsModule,
} from 'ng-apexcharts';


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  grid: ApexGrid;
  colors: string[];
  labels: string[];
};

@Component({
  selector: 'app-projects-overview',
  
  templateUrl: './projects-overview.component.html',
  styleUrl: './projects-overview.component.css'
})
export class ProjectsOverviewComponent {
  @Input() summary:any
  public chartOptions!: Partial<ChartOptions>;
  globalAvgResponse: string='';
  endpointsWithNotifications: number = 0;
  endpointsOffNotifications: number = 0;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['summary'] && this.summary) {
      this.updateChartOptions();
    }
  }

  private updateChartOptions(): void {
    const projectNames = this.summary.map((p: any) => p.projectName);
    const endpoints = this.summary.map((p: any) => p.totalEndpoints);
    const avgResponse = this.summary.map((p: any) => {
      const rawValue = typeof p.avgResponseTime === 'string'
          ? parseFloat(p.avgResponseTime)
          : p.avgResponseTime;

        if (!rawValue || isNaN(rawValue)) {
          return 0;
        }

        return +(rawValue / 100).toFixed(1);

    });



    const downs = this.summary.map((p: any) => p.down);
    const ups = this.summary.map((p: any) => p.up);
    const totalUsers = this.summary.map((p: any) => p.totalUsers);

    const avgTimes = this.summary
    .map((p: { avgResponseTime: string; }) => typeof p.avgResponseTime === 'string' ? parseFloat(p.avgResponseTime) : p.avgResponseTime)
    .filter((n: number) => !isNaN(n) && n > 0);

    this.globalAvgResponse = avgTimes.length
      ? (avgTimes.reduce((a: any, b: any) => a + b, 0) / avgTimes.length).toFixed(2)
      : '0.00';

    // Proyectos con notificaciones activadas
    this.endpointsWithNotifications = this.summary.reduce((sum: any, p: { notificationsOn: any; }) => sum + p.notificationsOn, 0);
    this.endpointsOffNotifications = this.summary.reduce((sum: any, p: { notificationsOff: any; }) => sum + p.notificationsOff, 0);
    
    this.chartOptions = {
      series: [
        {
          name: 'Endpoints',
          type: 'column',
          data: endpoints
        },
        {
          name: 'Up endpoints',
          type: 'line',
          data: ups
        },
        {
          name: 'Down endpoints',
          type: 'line',
          data: downs
        },
        {
          name: 'Users',
          type: 'area',
          data: totalUsers
        },
      ],
      chart: {
        height: 300,
        type: 'line',
        stacked: false,
        toolbar: { show: false }
      },
      stroke: {
        width: [0, 3, 3,3],
        // curve: 'smooth'
        curve: 'straight',
        dashArray: [0, 5, 5,0],
      },
      plotOptions: {
        bar: {
          columnWidth: '18%',
          borderRadius: 6,
        },
      },
      
      fill: {
        type: 'gradient',
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: 'vertical',
          opacityFrom: 0.9,
          opacityTo: 0.6,
          stops: [0, 90, 100]
        }
      },
      colors: ['#1E90FF', '#3AC977', '#FF5E5E','#FF9F00'],
      labels: projectNames,
      xaxis: {
        categories: projectNames,
        labels: {
          style: {
            fontSize: '13px',
            colors: '#888888'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            fontSize: '13px',
            colors: '#888888'
          }
        }
      },
      legend: {
        fontSize: '13px',
        fontFamily: 'Poppins',
        labels: {
          colors: '#888888'
        }
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (y: number) => y !== undefined ? y.toFixed(0) : y
        }
      },
      markers: {
        size: 5
      },
      grid: {
        borderColor: '#f1f1f1'
      }
    };
  }

}
