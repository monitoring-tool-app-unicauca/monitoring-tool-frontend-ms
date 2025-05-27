import { ProjectService } from './../../../../monitoring/services/project/project.service';
import { Component } from '@angular/core';
import { Breadcrumb } from '../../../../shared/interfaces/Breadcrum.interface';
import { environment } from '../../../../../environment/environment';

@Component({
  selector: 'app-admin-index',
  templateUrl: './admin-index.component.html',
  styleUrl: './admin-index.component.css'
})
export class AdminIndexComponent {

  breadcrumbList: Breadcrumb = {
    title: 'User',
    subTitle: 'Dashboard',
    items: [
      { label: 'Home', url: '/admin/index' },
      { label: 'Dashboard' },
      
    ]
  };

  NewCustomers:any
  AllProjects:any 
  AllNotifications:any 
  summary: any
  maxProjects = environment.MAX_NUMBER_PROJECTS;
  notificationsOn:any
  notificationsOff:any
  constructor(
    private projectService: ProjectService
  ){

  }
  ngOnInit(): void {
    
    const page = 0
    const size = 50
    const sort = ''

  this.projectService.getAllProjects(page,size,sort).subscribe((response: any) => {
  
    this.summary  = this.procesarTodosLosProyectos(response);
    console.log('Resumen por proyecto:', this.summary);
    this.initChartStyle()
  });
}


get progressPercent(): number {
  return (this.summary?.length || 0) / this.maxProjects * 100;
}
 procesarTodosLosProyectos(responseData :any) {
  if (!responseData || !responseData.content) return [];

  return responseData.content.map((proyecto: { healthEndpoints: never[]; projectId: any; projectName: any; users: any; }) => {
    const endpoints = proyecto.healthEndpoints || [];
    const total = endpoints.length;

    const active = endpoints.filter((e: { active: any; }) => e.active).length;
    const inactive = endpoints.filter((e: { active: any; }) => !e.active).length;

    const up = endpoints.filter((e: { status: string; }) => e.status === 'UP').length;
    const down = endpoints.filter((e: { status: string; }) => e.status === 'DOWN').length;

    const notificationsOn = endpoints.filter((e: { notificationsEnabled: any; }) => e.notificationsEnabled).length;
    const notificationsOff = endpoints.filter((e: { notificationsEnabled: any; }) => !e.notificationsEnabled).length;

    const avgResponseTime = total > 0
      ? (endpoints.reduce((sum: any, e: { responseTimeMs: any; }) => sum + e.responseTimeMs, 0) / total).toFixed(2)
      : 0;

    const totalUsers = proyecto.users.length;
    
    return {
      projectId: proyecto.projectId,
      projectName: proyecto.projectName,
      totalEndpoints: total,
      active,
      inactive,
      up,
      down,
      downPercentage: total > 0 ? parseFloat(((down / total) * 100).toFixed(2)) : 0,
      notificationsOn,
      notificationsOff,
      avgResponseTime: avgResponseTime,
      totalUsers: totalUsers,
      users: (proyecto.users || []).map((u: { name: any; lastName: any; email: any; }) => ({
        fullName: `${u.name} ${u.lastName}`,
        email: u.email
      }))
    };
  });
}

  initChartStyle(){
    console.log("series 0",this.summary)
    const totalActive = this.summary.reduce((sum: any, p: { active: any; }) => sum + p.active, 0);
    const totalInactive = this.summary.reduce((sum: any, p: { inactive: any; }) => sum + p.inactive, 0);

    const dataUsuariosPorProyecto = this.summary.map((p: { users: string | any[]; }) => p.users.length);
    this.summary.totalUsers = this.summary.reduce((sum: any, p: { totalUsers: number; }) => sum + p.totalUsers, 0);

    // Proyectos con notificaciones activadas
    this.notificationsOn = this.summary.reduce((sum: any, p: { notificationsOn: any; }) => sum + p.notificationsOn, 0);
    this.notificationsOff = this.summary.reduce((sum: any, p: { notificationsOff: any; }) => sum + p.notificationsOff, 0);
    
    console.log("Active Inactive ",totalActive,totalInactive)
    console.log("datausuarios ",this.summary.totalUSers)
    this.NewCustomers = {
      series: [
        {
          name: 'Net Profit',
          data: dataUsuariosPorProyecto,
          /* radius: 30,	 */
        },
      ],
      chart: {
        type: 'area',
        height: 40,
        //width: 400,
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

      colors: ['var(--primary)'],
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
        categories: this.summary.map((p: { projectId: any; }) => p.projectId),
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
          enabled: true,
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
        enabled: false,
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: function (val: any) {
            return "$" + val + " thousands"
          }
        }
      }
    };

    this.AllProjects = {
    series: [totalActive, totalInactive],
    chart: {
      type: 'donut',
      width: 170,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '80%',
          labels: {
            show: true,
            name: {
              show: true,
              offsetY: 12,
            },
            value: {
              show: true,
              fontSize: '22px',
              fontFamily: 'Arial',
              fontWeight: '500',
              offsetY: -17,
            },
            total: {
              show: true,
              fontSize: '11px',
              fontWeight: '500',
              fontFamily: 'Arial',
              label: 'Total',

              formatter: function (w: { globals: { seriesTotals: any[]; }; }) {
                return w.globals.seriesTotals.reduce((a: any, b: any) => {
                  return a + b
                }, 0)
              }
            }
          }
        }
      }
    },
    legend: {
      show: false,
    },
    colors: ['#3AC977', 'var(--primary)', 'var(--secondary)'],
    labels: ["Active", "Inactive", "Unknown"],
    dataLabels: {
      enabled: false,
    },
  };

  this.AllNotifications = {
    series: [this.notificationsOn, this.notificationsOff],
    chart: {
      type: 'donut',
      width: 170,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '80%',
          labels: {
            show: true,
            name: {
              show: true,
              offsetY: 12,
            },
            value: {
              show: true,
              fontSize: '22px',
              fontFamily: 'Arial',
              fontWeight: '500',
              offsetY: -17,
            },
            total: {
              show: true,
              fontSize: '11px',
              fontWeight: '500',
              fontFamily: 'Arial',
              label: 'Total',

              formatter: function (w: { globals: { seriesTotals: any[]; }; }) {
                return w.globals.seriesTotals.reduce((a: any, b: any) => {
                  return a + b
                }, 0)
              }
            }
          }
        }
      }
    },
    legend: {
      show: false,
    },
    colors: ['#3AC977', '#FF5E5E'],
    labels: ["On", "Off"],
    dataLabels: {
      enabled: false,
    },
  };
  }
}
