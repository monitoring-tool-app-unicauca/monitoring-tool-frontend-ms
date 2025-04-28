import { Component, Input, ViewChild, ElementRef, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

@Component({
  selector: 'app-health-endpoint-line-chart',
  templateUrl: './health-endpoint-line-chart.component.html',
  styleUrls: ['./health-endpoint-line-chart.component.css']
})
export class HealthEndpointLineChartComponent implements AfterViewInit {
  @Input() endpoint: any;
  @ViewChild('endpointChart') endpointChartRef!: ElementRef<HTMLCanvasElement>;

  chart: any;


  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['endpoint'] && this.endpoint) {
  //     this.initChart();
  //   }
  // }

  ngAfterViewInit() {
    // Aquí es donde se asegura que la vista esté completamente cargada
    this.initChart();
  }
  initChart() {
    if (this.chart) {
      this.chart.destroy(); // Si ya hay un chart previo, lo destruyo
    }

    const ctx = this.endpointChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [], // Aquí pondremos las fechas
        datasets: [{
          label: 'Response Time (ms)',
          borderColor: 'rgb(75, 192, 192)',
          data: [],
          fill: false,
          tension: 0.3 // Línea más suavizada
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'category', // importantísimo para fechas
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
        }
      }
    });

    // Si quieres dibujar un punto inicial:
    if (this.endpoint?.responseTimeMs) {
      this.addPoint(new Date(), this.endpoint.responseTimeMs);
    }
  }

  addPoint(time: Date, responseTime: number) {
    if (this.chart) {
      this.chart.data.labels.push(time.toLocaleTimeString()); // o toISOString() si quieres fecha completa
      this.chart.data.datasets[0].data.push(responseTime);
      this.chart.update();
    }
  }

}
