import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../../../admin/services/user/user.service';
import { UserDto } from '../../../admin/interfaces/userDTO';


@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrl: './project-overview.component.css'
})
export class ProjectOverviewComponent {
  breadcrumbList = {
    breadcrumb_path: 'Projects',
    currentURL: 'Overview',
  }
  dropdown_item = {
    select: 'Slow All',
    value: ['Slow All', 'In Stock', 'Out of Stock']
  }

  @Input() project: any

  responsibleUsers: UserDto[] = [];
  defaultImage= 'assets/images/user/default_tab.jpg'
  constructor(
    private userService: UserService
  ){

  }
  ngOnInit() {
    if (this.project?.responsibleUserIds?.length > 0) {
      this.getResponsibleUsers(this.project.responsibleUserIds);
    }
  }

  getResponsibleUsers(ids: number[]) {
    this.userService.getUsersByIds(ids).subscribe(
      (response) => {

        const users = response.data? response.data: []; // Acceder al array real de usuarios

        users.forEach((user) => {
          const userObj: any = {
            userId: user.userId,
            name: user.name,
            email: user.email,
            userImage: '',
            documentNumber: '',
            lastName: '',
            phoneNumber: 0,
            imageUrl: '' // ← este campo lo estás usando para mostrar la imagen
          };
          if (user.userId !== undefined) {
            this.userService.getUserImage(user.userId!).subscribe({
              next: (blob) => {
                const reader = new FileReader();
                reader.onload = () => {
                  userObj.userImage = reader.result as string;
                  this.responsibleUsers.push(userObj);
                };
                reader.readAsDataURL(blob); // <-- esta línea convierte correctamente el blob a Base64
              },
              error: () => {
                userObj.userImage = 'assets/images/user/default_tab.jpg';
                this.responsibleUsers.push(userObj);
              }
            });

          }
          })
        },


      (error) => console.error('Error fetching users', error)
    );

  }

  chartTopSelling = {
    series: [17, 8, 8, 17, 17, 8, 25],
    chart: {
      type: 'donut',
      width: 350,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '90%',
          labels: {
            show: true,
            name: {
              show: true,
              offsetY: 20,
            },
            value: {
              show: true,
              fontSize: '24px',
              color: 'var(--text-dark)',
              fontWeight: '600',
              offsetY: -16,
            },
            total: {
              show: true,
              fontSize: '14px',
              color: 'var(--text-dark)',
              fontWeight: '500',
              label: 'Total',

              formatter: function (w: any) {
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
    colors: [
      'var(--primary)',
      'var(--bs-success)',
      'var(--bs-danger)',
      'var(--bs-warning)',
      'var(--bs-purple)',
      'var(--bs-dark)',
      'var(--bs-secondary)',
    ],
    labels: [
      "Laptop",
      "Phone",
      "Keyboard",
      "Mouse",
      "Monitors",
      "Watch",
      "Earbuds",
    ],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 3,
      colors: [
        'var(--bs-white)',
      ],
    },
    responsive: [
      {
        breakpoint: 1480,
        options: {
          chart: {
            type: 'donut',
            width: 250,
          },
        }
      }
    ]
  };
}
