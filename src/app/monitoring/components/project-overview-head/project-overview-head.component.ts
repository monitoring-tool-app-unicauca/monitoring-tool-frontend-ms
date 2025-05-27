import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { ProjectService } from '../../services/project/project.service';
import { ProjectCompleteResponseDto } from '../../interfaces/projectDTO';

@Component({
  selector: 'app-project-overview-head',

  templateUrl: './project-overview-head.component.html',
  styleUrl: './project-overview-head.component.css'
})
export class ProjectOverviewHeadComponent {
  breadcrumbList = {
    breadcrumb_path: 'Projects',
    currentURL: 'Overview',
  }
  currentUrl: string = '';
  @Input() projectId: any
  @Output() exit: EventEmitter<any> = new EventEmitter<any>()
  project!: ProjectCompleteResponseDto
  activeTab: string = 'overview';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
  goBack(){
    this.exit.emit()
  }
  constructor(
    private router: Router, 
    private location: Location,
    private projectService: ProjectService

  ) {
    this.currentUrl = this.router.url;
  }
  ngOnInit(){
    this.reloadProject()
  }
  reloadProject() {
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (response) => {
        this.project = {
          ...response.data,
          users: response.data.users ?? []
        };
        this.activeTab='endpoints';
      },
      error: (err) => {
        console.error('Error al recargar el proyecto', err);
      }
    });
  }

  chartProfileProgress = {
    series: [
      {
        name: 'Net Profit',
        data: [100, 300, 200, 250, 200, 240, 180, 230, 200, 250, 300],
      },
    ],
    chart: {
      type: 'area',
      height: 70,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false
      },
      sparkline: {
        enabled: true
      }
    },
    colors: [
      'var(--primary)'
    ],
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    stroke: {
      show: true,
      width: 2,
      curve: 'straight',
      colors: ['var(--primary)'],
    },
    grid: {
      show: false,
      borderColor: '#eee',
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: -1
      }
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0
        }
      },
      hover: {
        filter: {
          type: 'none',
          value: 0
        }
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0
        }
      }
    },
    xaxis: {
      categories: [
        'Jan',
        'feb',
        'Mar',
        'Apr',
        'May',
        'June',
        'July',
        'August',
        'Sept',
        'Oct'
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false
      },
      labels: {
        show: false,
        style: {
          fontSize: '12px',
        }
      },
      crosshairs: {
        show: false,
        position: 'front',
        stroke: {
          width: 1,
          dashArray: 3
        }
      },
      tooltip: {
        enabled: false,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: '12px',
        }
      }
    },
    yaxis: {
      show: false,
    },
    fill: {
      opacity: 0.9,
      colors: 'var(--primary)',
      type: 'gradient',
      gradient: {
        colorStops: [
          {
            offset: 0,
            color: 'var(--primary)',
            opacity: .4
          },
          {
            offset: 0.6,
            color: 'var(--primary)',
            opacity: .4
          },
          {
            offset: 100,
            color: 'white',
            opacity: 0
          }
        ],
      }
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val: any) {
          return "$" + val
        }
      }
    }
  };
}
