
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, Location, NgClass, PlatformLocation } from '@angular/common';
import { SafeHtmlSvgPipe } from '../../_services/svg-pipe/safe-html-svg.pipe';
interface MenuItem {
  label?: string
  title: string;
  icon?: string;
  route?: string;
  badge?: boolean;
  subMenu?: {
    title: string;
    route?: string;
    theme?: string;
    subBadge?: boolean;
    subsubMenu?: { title: string; route: string; }[]
  }[];
}
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, NgClass, RouterLink, SafeHtmlSvgPipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {

  @Output() newTitleEvent = new EventEmitter<{ title: string }>(); // DashBoard Title
  @Output() mouseHoverEvent = new EventEmitter<string>(); // Data pass Admin page

  email: string = 'marquezzzz@mail.com';
  activeToggle: string = '';
  localData: any = '';
  elementValue: any = '';
  currentHref: string = "";
  public isVisited = false;
  svgContent: string = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M2.5 7.49999L10 1.66666L17.5 7.49999V16.6667C17.5 17.1087 17.3244 17.5326 17.0118 17.8452C16.6993 18.1577 16.2754 18.3333 15.8333 18.3333H4.16667C3.72464 18.3333 3.30072 18.1577 2.98816 17.8452C2.67559 17.5326 2.5 17.1087 2.5 16.6667V7.49999Z" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M7.5 18.3333V10H12.5V18.3333" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>`;

  constructor(private router: Router, private location: Location, private backLocation: PlatformLocation) {
    router.events.subscribe((val) => {
      if (location.path() != '') {
        this.currentHref = location.path();
      } else {
        this.currentHref = '/index'
      }
    });
    backLocation.onPopState(() => {   // back click get url
      this.handleActiveMenu(window.location.pathname);
    });
  }

  ngDoCheck(): void {
    this.elementValue = document.body.getAttribute('data-theme-version');
  }

  getActive(menu: any) {     //  side menu manage
    if (this.activeToggle != menu) {
      this.activeToggle = menu;
    } else {
      this.activeToggle = '';
    }
  }
  hoverAdd(val: any) {
    const getStyle = document.body.getAttribute('data-sidebar-style')
    if (getStyle == 'icon-hover') {
      this.mouseHoverEvent.emit(val);
    }
  }
  checkVisited() {
    this.isVisited = !this.isVisited;
  }
  ngOnInit(): void {
    this.elementValue = document.body.getAttribute('data-theme-version');
    this.handleActiveMenu(this.currentHref);
  }

  themeMode(menu: any) {    // dark-light theme set function
    this.activeSubMenu = '';
    localStorage.setItem("data-theme-version", menu);
    this.localData = localStorage.getItem('data-theme-version');
    this.elementValue = this.localData;
    document.body.setAttribute('data-theme-version', this.localData);
  }

  activeMenu: string = "";
  activeSubMenu: string = "";
  activeSubSubMenu: string = "";

  handleActiveMenu(val: any) {
    this.sidebarMenu.map((data: any, ind: any) => {
      if (data.route == val) {
        this.activeMenu = data.title;
      }
      data.subMenu?.map((item: any, ind: any) => {
        if (item.route == val) {
          this.activeMenu = data.title;
          this.activeSubMenu = item.title;
          this.activeSubSubMenu = "";
        }
        item.subsubMenu?.map((item1: any, ind: any) => {
          if (item1.route == val) {
            this.activeMenu = data.title;
            this.activeSubMenu = item.title;
            this.activeSubSubMenu = item1.title
          }
        })
      })
    })
    this.newTitleEvent.emit({ title: this.activeMenu });
  }

  handleMenu(val: any) {
    if (this.activeMenu == "Chat") {
      this.activeMenu = val;
    } else {
      if (this.activeMenu == val) {
        this.activeMenu = "";
      } else {
        this.activeMenu = val;
      }
    }
  }
  handleActiveSubMenu(val: any) {
    if (this.activeSubMenu == val) {
      this.activeSubMenu = "";
    } else {
      this.activeSubMenu = val;
    }
  }


  sidebarMenu: MenuItem[] = [
    {
      label: 'YOUR COMPANY',
      title: "Dashboard",
      icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 7.49999L10 1.66666L17.5 7.49999V16.6667C17.5 17.1087 17.3244 17.5326 17.0118 17.8452C16.6993 18.1577 16.2754 18.3333 15.8333 18.3333H4.16667C3.72464 18.3333 3.30072 18.1577 2.98816 17.8452C2.67559 17.5326 2.5 17.1087 2.5 16.6667V7.49999Z" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7.5 18.3333V10H12.5V18.3333" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
      subMenu: [
        {
          title: "Dashboard Light",
          route: "/admin",
          theme: "light"
        },
        {
          title: "Dashboard Dark",
          route: "/admin",
          theme: "dark"
        }
      ]
    },
    {
      title: "Employees",
      route: "/admin/employee",
      icon: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.986 14.0673C7.4407 14.0673 4.41309 14.6034 4.41309 16.7501C4.41309 18.8969 7.4215 19.4521 10.986 19.4521C14.5313 19.4521 17.5581 18.9152 17.5581 16.7693C17.5581 14.6234 14.5505 14.0673 10.986 14.0673Z" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.986 11.0054C13.3126 11.0054 15.1983 9.11881 15.1983 6.79223C15.1983 4.46564 13.3126 2.57993 10.986 2.57993C8.65944 2.57993 6.77285 4.46564 6.77285 6.79223C6.76499 9.11096 8.63849 10.9975 10.9563 11.0054H10.986Z" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>`,
    },
    {
      title: "Core HR",
      route: "/admin/core-hr",
      icon: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.8381 12.7317C16.4566 12.7317 16.9757 13.2422 16.8811 13.853C16.3263 17.4463 13.2502 20.1143 9.54009 20.1143C5.43536 20.1143 2.10834 16.7873 2.10834 12.6835C2.10834 9.30245 4.67693 6.15297 7.56878 5.44087C8.19018 5.28745 8.82702 5.72455 8.82702 6.36429C8.82702 10.6987 8.97272 11.8199 9.79579 12.4297C10.6189 13.0396 11.5867 12.7317 15.8381 12.7317Z" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M19.8848 9.1223C19.934 6.33756 16.5134 1.84879 12.345 1.92599C12.0208 1.93178 11.7612 2.20195 11.7468 2.5252C11.6416 4.81493 11.7834 7.78204 11.8626 9.12713C11.8867 9.5459 12.2157 9.87493 12.6335 9.89906C14.0162 9.97818 17.0914 10.0862 19.3483 9.74467C19.6552 9.69835 19.88 9.43204 19.8848 9.1223Z" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>`,
    },
    {
      title: "Tasks",
      icon: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5346 2.55658H7.1072C4.28845 2.55658 2.52112 4.55216 2.52112 7.37733V14.9985C2.52112 17.8237 4.2802 19.8192 7.1072 19.8192H15.1959C18.0238 19.8192 19.7829 17.8237 19.7829 14.9985V11.3062" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.09214 10.0108L14.9424 3.16057C15.7958 2.30807 17.1791 2.30807 18.0325 3.16057L19.1481 4.27615C20.0015 5.12957 20.0015 6.51374 19.1481 7.36624L12.2648 14.2495C11.8917 14.6226 11.3857 14.8325 10.8577 14.8325H7.42389L7.51006 11.3675C7.52289 10.8578 7.73097 10.372 8.09214 10.0108Z" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.9014 4.21895L18.0869 8.40445" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>`,
      subMenu: [
        {
          title: "Task",
          route: "/admin/task"
        },
        {
          title: "Task Summary",
          route: "/admin/task-summary"
        }
      ]
    },
    {
      title: "Performance",
      route: "/admin/performance",
      icon: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path fill-rule="evenodd" clip-rule="evenodd" d="M14.9732 2.52102H7.0266C4.25735 2.52102 2.52118 4.48177 2.52118 7.25651V14.7438C2.52118 17.5186 4.2491 19.4793 7.0266 19.4793H14.9723C17.7507 19.4793 19.4795 17.5186 19.4795 14.7438V7.25651C19.4795 4.48177 17.7507 2.52102 14.9732 2.52102Z" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M7.73657 11.0002L9.91274 13.1754L14.2632 8.82493" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>`,
    },
    {
      title: "Projects",
      route: "/admin/project",
      icon: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M6.75713 9.35157V15.64" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M11.0349 6.34253V15.64" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M15.2428 12.6746V15.64" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
									<path fill-rule="evenodd" clip-rule="evenodd" d="M15.2952 1.83333H6.70474C3.7103 1.83333 1.83331 3.95274 1.83331 6.95306V15.0469C1.83331 18.0473 3.70157 20.1667 6.70474 20.1667H15.2952C18.2984 20.1667 20.1666 18.0473 20.1666 15.0469V6.95306C20.1666 3.95274 18.2984 1.83333 15.2952 1.83333Z" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>`,
    },
    {
      label: 'FEATURES',
      title: "Profile",
      icon: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path fill-rule="evenodd" clip-rule="evenodd" d="M10.986 14.0673C7.4407 14.0673 4.41309 14.6034 4.41309 16.7501C4.41309 18.8969 7.4215 19.4521 10.986 19.4521C14.5313 19.4521 17.5581 18.9152 17.5581 16.7693C17.5581 14.6234 14.5505 14.0673 10.986 14.0673Z" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
									<path fill-rule="evenodd" clip-rule="evenodd" d="M10.986 11.0054C13.3126 11.0054 15.1983 9.11881 15.1983 6.79223C15.1983 4.46564 13.3126 2.57993 10.986 2.57993C8.65944 2.57993 6.77285 4.46564 6.77285 6.79223C6.76499 9.11096 8.63849 10.9975 10.9563 11.0054H10.986Z" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>`,
      subMenu: [
        {
          title: "Overview",
          route: "/admin/profile/overview"
        },
        {
          title: "Projects",
          route: "/admin/profile/projects"
        },
        {
          title: "Projects Details",
          route: "/admin/profile/projects-details"
        }
      ]
    },
    {
      title: "Accounts",
      icon: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path fill-rule="evenodd" clip-rule="evenodd" d="M10.986 14.0673C7.4407 14.0673 4.41309 14.6034 4.41309 16.7501C4.41309 18.8969 7.4215 19.4521 10.986 19.4521C14.5313 19.4521 17.5581 18.9152 17.5581 16.7693C17.5581 14.6234 14.5505 14.0673 10.986 14.0673Z" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
									<path fill-rule="evenodd" clip-rule="evenodd" d="M10.986 11.0054C13.3126 11.0054 15.1983 9.11881 15.1983 6.79223C15.1983 4.46564 13.3126 2.57993 10.986 2.57993C8.65944 2.57993 6.77285 4.46564 6.77285 6.79223C6.76499 9.11096 8.63849 10.9975 10.9563 11.0054H10.986Z" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>`,
      subMenu: [
        {
          title: "Overview",
          route: "/admin/account/overview"
        },
        {
          title: "Settings",
          route: "/admin/account/settings"
        },
        {
          title: "Logs",
          route: "/admin/account/logs"
        }
      ]
    },
    {
      title: "Apps",
      icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M7.11086 10.2878V13.7208" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M8.86244 12.0045H5.35974" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M13.0856 10.3924H12.9875" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M14.748 13.6691H14.6499" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M6.39948 0.833328C6.39948 1.5121 6.96092 2.06236 7.65349 2.06236H8.62193C9.69042 2.06617 10.5559 2.9144 10.5608 3.9616V4.5804" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
									<path fill-rule="evenodd" clip-rule="evenodd" d="M14.0593 19.1324C11.3045 19.1791 8.60026 19.1771 5.94166 19.1324C2.99069 19.1324 0.833313 17.0275 0.833313 14.1354V9.87325C0.833313 6.98107 2.99069 4.8762 5.94166 4.8762C8.61483 4.83051 11.321 4.83146 14.0593 4.8762C17.0102 4.8762 19.1666 6.98203 19.1666 9.87325V14.1354C19.1666 17.0275 17.0102 19.1324 14.0593 19.1324Z" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>`,
      subMenu: [
        {
          title: "Users Manager",
          subsubMenu: [
            {
              title: "User",
              route: "/admin/user"
            },
            {
              title: "Add User",
              route: "/admin/add-user"
            },
            {
              title: "Roles Listing",
              route: "/admin/user-roles"
            },
            {
              title: "Add Roles",
              route: "/admin/add-role"
            },
            {
              title: "Profile 1",
              route: "/admin/app-profile-1"
            },
            {
              title: "Edit Profile",
              route: "/admin/edit-profile"
            },
          ]
        },
      ]
    },
    {
      title: "Charts",
      icon:  `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" clip-rule="evenodd" d="M14.8381 11.7317C15.4566 11.7317 15.9757 12.2422 15.8811 12.853C15.3263 16.4463 12.2502 19.1143 8.54009 19.1143C4.43536 19.1143 1.10834 15.7873 1.10834 11.6835C1.10834 8.30245 3.67693 5.15297 6.56878 4.44087C7.19018 4.28745 7.82702 4.72455 7.82702 5.36429C7.82702 9.69868 7.97272 10.8199 8.79579 11.4297C9.61886 12.0396 10.5867 11.7317 14.8381 11.7317Z" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
								<path fill-rule="evenodd" clip-rule="evenodd" d="M18.8848 8.12229C18.934 5.33755 15.5134 0.848777 11.345 0.92597C11.0208 0.93176 10.7612 1.20194 10.7468 1.52518C10.6416 3.81492 10.7834 6.78202 10.8626 8.12711C10.8867 8.54588 11.2157 8.87492 11.6335 8.89904C13.0162 8.97816 16.0914 9.08623 18.3483 8.74465C18.6552 8.69834 18.88 8.43202 18.8848 8.12229Z" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>`,
      subMenu: [
        {
          title: "Apex Chart",
          subsubMenu: [
            {
              title: "Area Charts",
              route: "/admin/apex-area"
            },
            {
              title: "Bar Charts",
              route: "/admin/apex-bar"
            },
            {
              title: "Bubble Charts",
              route: "/admin/apex-bubble"
            },
            {
              title: "Candlestick Charts",
              route: "/admin/apex-candlestick"
            },
            {
              title: "Column Charts",
              route: "/admin/apex-column"
            },
            {
              title: "Heatmap Charts",
              route: "/admin/apex-heatmap"
            },
            {
              title: "Line Charts",
              route: "/admin/apex-line"
            },
            {
              title: "Mixed / Combo Charts",
              route: "/admin/apex-mixed"
            },
            {
              title: "Pie / Donuts",
              route: "/admin/apex-pie"
            },
            {
              title: "Polar Area Charts",
              route: "/admin/apex-polar-area"
            },
            {
              title: "Radar Charts",
              route: "/admin/apex-radar"
            },
            {
              title: "RadialBar / Circle Charts",
              route: "/admin/apex-radialbar"
            },
            {
              title: "Scatter Charts",
              route: "/admin/apex-scatter"
            },
            {
              title: "Sparklines Charts",
              route: "/admin/apex-sparklines"
            },
            {
              title: "Timeline Charts",
              route: "/admin/apex-timeline"
            },
            {
              title: "Treemap Charts",
              route: "/admin/apex-treemap"
            }
          ]
        },
        {
          title: "Chartjs",
          subsubMenu: [
            {
              title: "General Chartjs",
              route: "/admin/chartjs-general"
            },
            {
              title: "Animation Charts",
              route: "/admin/chartjs-animation"
            },
            {
              title: "Bar Charts",
              route: "/admin/chartjs-bar"
            },
            {
              title: "Line Charts",
              route: "/admin/chartjs-line"
            },
            {
              title: "Area Charts",
              route: "/admin/chartjs-area"
            },
            {
              title: "Bubble Charts",
              route: "/admin/chartjs-bubble"
            }
          ]
        }
      ]
    },
    {
      title: "Pages",
      icon: `	<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path fill-rule="evenodd" clip-rule="evenodd" d="M16.3691 18.7157C18.086 18.7157 19.4784 17.3242 19.4793 15.6073V15.6055V13.1305C18.3454 13.1305 17.4269 12.212 17.426 11.078C17.426 9.94504 18.3445 9.02562 19.4784 9.02562H19.4793V6.55062C19.4812 4.83279 18.0906 3.43946 16.3737 3.43762H16.3682H5.63216C3.91433 3.43762 2.52191 4.82912 2.521 6.54696V6.54787V9.10537C3.6155 9.06687 4.53308 9.92304 4.57158 11.0175C4.5725 11.0377 4.57341 11.0579 4.57341 11.078C4.57433 12.2101 3.65858 13.1286 2.5265 13.1305H2.521V15.6055C2.52008 17.3224 3.9125 18.7157 5.62941 18.7157H5.63033H16.3691Z" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
									<path fill-rule="evenodd" clip-rule="evenodd" d="M11.3403 8.30788L11.905 9.45096C11.96 9.5628 12.0663 9.64071 12.1901 9.65905L13.4523 9.8433C13.7649 9.88913 13.8887 10.2723 13.6632 10.4914L12.7502 11.3805C12.6603 11.4676 12.62 11.5932 12.6402 11.717L12.8556 12.9728C12.9087 13.2835 12.5833 13.52 12.3047 13.3734L11.1762 12.7803C11.0653 12.7216 10.9333 12.7216 10.8224 12.7803L9.69491 13.3734C9.41533 13.52 9.08991 13.2835 9.14308 12.9728L9.3585 11.717C9.37958 11.5932 9.33833 11.4676 9.2485 11.3805L8.33641 10.4914C8.11091 10.2723 8.23466 9.88913 8.54633 9.8433L9.80858 9.65905C9.93233 9.64071 10.0396 9.5628 10.0946 9.45096L10.6583 8.30788C10.7977 8.02555 11.201 8.02555 11.3403 8.30788Z" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>`,
      subMenu: [
        {
          title: "Login",
          route: "/page-login"
        },
        {
          title: "Register",
          route: "/page-register"
        },
        {
          title: "Forgot Password",
          route: "/page-forgot-password"
        },
        {
          title: "Error",
          subsubMenu: [
            {
              title: "Error 400",
              route: "/page-error-400"
            },
            {
              title: "Error 403",
              route: "/page-error-403"
            },
            {
              title: "Error 404",
              route: "/page-error-404"
            },
            {
              title: "Error 500",
              route: "/page-error-500"
            },
            {
              title: "Error 503",
              route: "/page-error-503"
            }
          ]
        },
        {
          title: "Lock Screen",
          route: "/page-lock-screen"
        },
        {
          title: "Empty Page",
          route: "/admin/empty-page"
        }
      ]
    },
  ]
}
