import { Component, Input, ViewChild, ElementRef, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale ,Tooltip} from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale,Tooltip,ChartDataLabels);

@Component({
  selector: 'app-health-endpoint-line-chart',
  templateUrl: './health-endpoint-line-chart.component.html',
  styleUrls: ['./health-endpoint-line-chart.component.css']
})
export class HealthEndpointLineChartComponent implements AfterViewInit {
  @Input() endpoint: any;
  @ViewChild('endpointChart') endpointChartRef!: ElementRef<HTMLCanvasElement>;

  chart: any;

  ngAfterViewInit() {
    this.initChart();
  }
  initChart() {
    if (this.chart) {
      // Si ya hay un chart previo, lo destruyo
      this.chart.destroy(); 
    }

    const ctx = this.endpointChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [], //fechas
        datasets: [{
          label: 'Response Time (ms)',
          borderColor: 'rgb(75, 192, 192)',
          data: [],
          fill: false,
          tension: 0.3 
        }]
      },
      options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'category',
          title: {
            display: true,
            text: 'Time'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Response Time (ms)'
          }
        }
      },
      plugins: {
        tooltip: {
          enabled: true,
          callbacks: {
            title: (tooltipItems) => `Date: ${tooltipItems[0].label}`,
            label: (tooltipItem) => `Response Time: ${tooltipItem.formattedValue} ms`
          }
        },
        datalabels: {
          anchor: 'end',
          align: 'top',
          formatter: (value) => `${value} ms`,
          font: {
            weight: 'bold'
          },
          color: '#333'
        }
      }
    }

    });

  }


  addPoint(time: Date, responseTime: number) {
  if (this.chart) {
    const label = time.toLocaleTimeString();
    this.chart.data.labels.push(label);
    this.chart.data.datasets[0].data.push(responseTime);

    // Limita a 20 puntos máximo
    if (this.chart.data.labels.length > 20) {
      this.chart.data.labels.shift();
      this.chart.data.datasets[0].data.shift();
    }

    const widthPerPoint = 80; 
    const totalPoints = this.chart.data.labels.length;
    const minWidth = Math.max(totalPoints * widthPerPoint, 1200);

    this.endpointChartRef.nativeElement.parentElement!.style.minWidth = `${minWidth}px`;
    this.chart.update();
  }
}

}
