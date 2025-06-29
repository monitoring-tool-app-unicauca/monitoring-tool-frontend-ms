import { ChangeDetectorRef, Component } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth/auth.service';
import { UserDto } from '../../../admin/interfaces/userDTO';
import { UserService } from '../../../admin/services/user/user.service';
import { Subscription } from 'rxjs';
import { SocketService } from '../../services/socket/socket.service';
import { NgxToastrService } from '../../../_services/ngx-toastr/ngx-toastr.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'] // Fixed property name
})
export class HeaderComponent {
  fullScreenClass: boolean = false;
  toggleMode: 'dark' | 'light' | undefined;
  localData: string | null = '';
  currentUser: any;
  userProfileImage: string | null = null;
  defaultImage: string = 'assets/images/user/default_tab.jpg';

  notifications: any[] = [];
  socketSub!: Subscription;

  hasUnreadNotifications = false;
  elementValue: any = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private cdRef: ChangeDetectorRef,
    private socketService: SocketService,
    private alertService: NgxToastrService
    ) {

    this.route.queryParams.subscribe((params: any) => {
      if (params.theme === 'dark' || params.theme === 'light') {
        localStorage.setItem("data-theme-version", params.theme);
      }
    });
  }

  ngOnInit(): void {
    this.localData = localStorage.getItem('data-theme-version');
    this.elementValue = this.localData || 'light';
    

    // Aplicar al cargar
    document.body.setAttribute('data-theme-version', this.elementValue);
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        if (user.userId) {
          this.loadProfileImage(user.userId);
        }
      }
    });

    this.socketSub = this.socketService.listen().subscribe((data: any) => {
      console.log("Notificación recibida:", data);
      const noti = {
        title: data.messageNotification || 'Nueva notificación',
        timestamp: new Date(),
        raw: data
      };
      this.alertService.info("New notification",'toast-top-right')
      this.notifications.unshift(noti);
      this.hasUnreadNotifications = true;
      this.cdRef.detectChanges();
    });


  }
  ngOnDestroy(): void {
    if (this.socketSub) this.socketSub.unsubscribe();
  }

  toggleTheme() {
    this.elementValue = localStorage.getItem('data-theme-version')
    const newTheme = this.elementValue === 'dark' ? 'light' : 'dark';
    localStorage.setItem('data-theme-version',newTheme);
  }

  markNotificationsAsRead() {
    this.hasUnreadNotifications = false;
  }

  logout(): void {

    this.authService.logout();

  }
  loadProfileImage(userId: string|number) {
    let userImage = this.defaultImage;

    if (userId !== undefined) {
      this.userService.getUserImage(+userId).subscribe({
        next: (blob) => {
          if (blob && blob.size > 0) {
            const reader = new FileReader();
            reader.onload = () => {
              userImage = reader.result as string;
              this.userProfileImage = userImage;
              this.cdRef.detectChanges();
            };
            reader.readAsDataURL(blob);
          } else {
            this.userProfileImage = userImage;
          }
        },
        error: () => {
          this.userProfileImage = userImage;
        }
      });
    } else {
      this.userProfileImage = userImage;
    }
  }


  ngDoCheck() {
    this.applyThemeMode();
  }

  applyThemeMode() {    // Theme mode dark - light
    this.localData = localStorage.getItem('data-theme-version');
    if (this.localData) {
      document.body.setAttribute('data-theme-version', this.localData);
    }
  }

  chatboxActive() { // Chatbox manage
    document.getElementById("chatBox")?.classList.add("active");
  }

  eventSidebarActive() { // Event Sidebar manage
    const sidebar = document.getElementById("eventSidebar");
    if (sidebar?.classList.contains('active')) {
      sidebar.classList.remove('active');
    } else {
      sidebar?.classList.add('active');
    }
  }

  themeMode() {     // Theme mode dark - light
    const elementValue = document.body.getAttribute('data-theme-version');
    this.localData = localStorage.getItem('data-theme-version');

    this.toggleMode = (elementValue === 'light' && this.localData === 'light') ? 'dark' : 'light';

    localStorage.setItem("data-theme-version", this.toggleMode);
    document.body.setAttribute('data-theme-version', this.toggleMode);
  }

  openFullscreen() {   // Trigger fullscreen
    const docElm = document.documentElement as HTMLElement & {
      mozRequestFullScreen(): Promise<void>;
      webkitRequestFullscreen(): Promise<void>;
      msRequestFullscreen(): Promise<void>;
    };

    if (!this.fullScreenClass) {
      this.fullScreenClass = true;
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      } else if (docElm.mozRequestFullScreen) { /* Firefox */
        docElm.mozRequestFullScreen();
      } else if (docElm.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        docElm.webkitRequestFullscreen();
      } else if (docElm.msRequestFullscreen) { /* IE/Edge */
        docElm.msRequestFullscreen();
      }
    } else {
      const doc = document as Document & {
        mozCancelFullScreen(): Promise<void>;
        webkitExitFullscreen(): Promise<void>;
        msExitFullscreen(): Promise<void>;
      };
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.mozCancelFullScreen) { /* Firefox */
        doc.mozCancelFullScreen();
      } else if (doc.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) { /* IE/Edge */
        doc.msExitFullscreen();
      }
      this.fullScreenClass = false;
    }
  }
}
