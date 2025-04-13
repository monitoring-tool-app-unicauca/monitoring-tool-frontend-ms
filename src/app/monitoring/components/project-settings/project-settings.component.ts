import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgxToastrService } from '../../../_services/ngx-toastr/ngx-toastr.service';
import { HealthService } from '../../services/health/health.service';

@Component({
  selector: 'app-project-settings',

  templateUrl: './project-settings.component.html',
  styleUrl: './project-settings.component.css'
})
export class ProjectSettingsComponent {

  breadcrumbList = {
    breadcrumb_path: 'Projects',
    currentURL: 'Settings',
  }
  @Input() project: any
  healthForm!: FormGroup;

  notificationForm!: FormGroup;

  endpointEvents = [
    { key: 'down', label: 'Endpoint Down' },
    { key: 'slow', label: 'Slow Performance' },
    { key: 'unavailable', label: 'Service Unavailable' },
    { key: 'highLatency', label: 'High Latency' },
    { key: 'errorRate', label: 'High Error Rate' },
    { key: 'recovery', label: 'Service Recovery' }
  ];

  constructor(
    private fb: FormBuilder,
    private alertService: NgxToastrService,
    private healthService: HealthService,
    ) {}

  ngOnInit(): void {
    this.initHealthForm();
    this.initNotificationForm();
  }
  initHealthForm(){
    this.healthForm = this.fb.group({
      projectId: [{ value: this.project.projectId, disabled: true }, Validators.required],
      url: ['', [Validators.required, Validators.pattern(/^(https?|ftp):\/\/[^ /$.?#].[^ ]*$/)]],
      active: [true, Validators.required],
      notificationsEnabled: [false, Validators.required],
      monitoringInterval: [null, [Validators.required, Validators.min(1)]]
    });
  }
  initNotificationForm(){
    const controls: any = {};
    this.endpointEvents.forEach(event => {
      controls[event.key + 'Email'] = [false];
      controls[event.key + 'Phone'] = [false];
    });

    this.notificationForm = this.fb.group(controls);
  }
  onSubmit(): void {
    if (this.healthForm.invalid) {
      this.healthForm.markAllAsTouched();
      return;
    }

    const payload = this.healthForm.getRawValue();

    this.healthService.createHealthEndpoint(payload).subscribe({
      next: () => {
        this.cleanForm()
        this.alertService.success('HealthEndpoint Created successfully', 'toast-top-left');
      },
      error: (err) => {
        console.error('Error creating health endpoint', err);
        // Mostrar error al usuario
      }
    });


    console.log(payload);


  }

  onSubmitNotificationForm(){

  }
  cleanForm(){
    this.healthForm.reset()
    this.notificationForm.reset()
  }
  onReset() {
    this.notificationForm.reset()
  }
}
