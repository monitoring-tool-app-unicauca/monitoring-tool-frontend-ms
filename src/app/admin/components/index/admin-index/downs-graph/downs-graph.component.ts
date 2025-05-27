import { Component, Input } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-downs-graph',
  templateUrl: './downs-graph.component.html',
  styleUrl: './downs-graph.component.css'
})
export class DownsGraphComponent {
  @Input() summary:any
  public chartOptions: any;
  public avgDownPercentage: number = 0;

  constructor() {}

  ngOnInit(): void {
    this.calculateAverage();
    this.setupChart();
  }
  ngOnChanges() {
    this.calculateAverage();  
  }

  calculateAverage(): void {
    if (!this.summary || !Array.isArray(this.summary)) return;

    const validDowns = this.summary.filter(p => typeof p.downPercentage === 'number');
    const total = validDowns.reduce((sum, project) => sum + project.downPercentage, 0);
    this.avgDownPercentage = validDowns.length ? +(total / validDowns.length).toFixed(2) : 0;
  }

  setupChart(): void {
    const chartWidth = document.getElementById('earningChart')?.offsetWidth || 0;

    const projectNames = this.summary.map((p: any) => p.projectName);
    const downPercentages = this.summary.map((p: any) => p.downPercentage);

    this.chartOptions = {
      series: [
        {
          name: '%Down',
          data: downPercentages
        }
      ],
      chart: {
        type: 'area',
        height: 350,
        width: chartWidth + 55,
        toolbar: { show: false },
        offsetX: -45,
        zoom: { enabled: false }
      },
      colors: ['#FF5E5E'],
      dataLabels: { enabled: false },
      legend: { show: true },
      stroke: {
        show: true,
        width: 2,
        curve: 'straight',
        colors: ['#FF5E5E']
      },
      grid: {
        show: true,
        borderColor: '#eee',
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: false } }
      },
      yaxis: {
        show: true,
        tickAmount: 4,
        labels: {
          offsetX: 40 ,
          formatter: (val: number) => val + '%'
        },
        min:0,
        max: 100
      },
      
      xaxis: {
        categories: projectNames,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          show: true,
          offsetX: 5,
          style: { fontSize: '12px' }
        }
      },
      fill: {
        opacity: 0.7,
        colors: '#FF5E5E',
        type: 'gradient',
        // gradient: {
        //   colorStops: [
        //     { offset: 0.6, color: 'var(--primary)', opacity: 0.2 },
        //     { offset: 0.6, color: 'var(--primary)', opacity: 0.15 },
        //     { offset: 100, color: 'white', opacity: 0 }
        //   ]
        // }
      },
      tooltip: {
        enabled: true,
        style: { fontSize: '12px' },
        y: {
          formatter: function (val: number) {
            return "$" + val + "";
          }
        }
      }
    };
  }

  updateSeries(seriesType: string): void {
    let columnData = [];

    switch (seriesType) {
      case 'day':
        columnData = [700, 650, 680, 650, 700, 610, 710, 620];
        break;
      case 'week':
        columnData = [700, 700, 680, 600, 700, 620, 710, 620];
        break;
      case 'month':
        columnData = [700, 650, 690, 640, 700, 670, 710, 620];
        break;
      case 'year':
        columnData = [700, 650, 590, 650, 700, 610, 710, 630];
        break;
      default:
        columnData = [700, 650, 680, 650, 700, 610, 710, 620];
    }

    this.chartOptions.series = [{
      name: 'Net Profit',
      data: columnData
    }];
  }

}
