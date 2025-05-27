import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() exit: EventEmitter<any> = new EventEmitter();
  @Output() endpointCreated = new EventEmitter<void>();
  healthForm!: FormGroup;

  notificationForm!: FormGroup;

  isEditMode:boolean = false
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
    this.healthService.endpointToEdit$.subscribe((endpoint) => {
      if (endpoint) {
        this.healthForm.patchValue(endpoint);
        this.isEditMode = true;
      }
    });
  }
  initHealthForm(){
    this.healthForm = this.fb.group({
      id:[''],
      projectId: [{ value: this.project.projectId, disabled: true }, Validators.required],
      url: ['', [Validators.required, Validators.pattern(/^(https?|ftp):\/\/[^ /$.?#].[^ ]*$/)]],
      active: [true, Validators.required],
      // notificationsEnabled: [false, Validators.required],
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

  deleteEndpoint() {
    const checkbox = document.getElementById('checkboxDeactivation') as HTMLInputElement;

    if (!checkbox?.checked) {
      this.alertService.warning('You must confirm the deactivation by checking the box.','toast-top-left');
      return;
    }

    const id = this.healthForm.get('id')?.value
    if (!id) {
      this.alertService.error('No health endpoint ID found.','toast-top-left');
      return;
    }

    this.healthService.deleteHealthEndpoint(id).subscribe({
      next: (response) => {
        this.alertService.success(response.message || 'Deleted successfully!','toast-top-left');
        this.cleanForm()
      },
      error: (error) => {
        const message = error?.error?.message || 'Error deleting health endpoint';
        this.alertService.error(message,'toast-top-left');
        console.error(error);
      }
    });
  }
  onSubmit(): void {
    if (this.healthForm.invalid) {
      this.healthForm.markAllAsTouched();
      this.alertService.warning('HealthEndpoint is INVALID', 'toast-top-left');
      return;
    }

    const endpointData = this.healthForm.value;

    // Construir un array de notificaciones activas
    const notificationValues = this.notificationForm.value;
    const activeNotifications: string[] = [];

    for (const key in notificationValues) {
      if (notificationValues[key]) {
        activeNotifications.push(key);
      }
    }
    const payload = {
      ...this.healthForm.getRawValue(),
      active: this.healthForm.value.active === 'true' || this.healthForm.value.active === true,
      notificationsEnabled: true,
      notificationTypes: activeNotifications
    };


    console.log("Payload Endpoint ", payload)
    if (this.isEditMode && payload.id) {
      this.healthService.updateHealthEndpoint(payload.id, payload).subscribe({
        next: () => {
          this.cleanForm();
          this.alertService.success('HealthEndpoint updated successfully', 'toast-top-left');
        },
        error: (err) => {
          console.error('Error updating health endpoint', err);
          this.alertService.error('Error updating healthendpoint','toast-rop-left')
        }
      });
    } else {
      delete payload.id;
      this.healthService.createHealthEndpoint(payload).subscribe({
        next: () => {
          this.cleanForm();
          this.alertService.success('HealthEndpoint created successfully', 'toast-top-left');
          this.endpointCreated.emit()
          
        },
        error: (err) => {
          console.error('Error creating health endpoint', err);
          this.alertService.error('Error creating healthendpoint','toast-rop-left')
        }
      });
    }
  }


  onSubmitNotificationForm(){

  }
  cleanForm(){
    const projectId = this.healthForm.get('projectId')?.value;

    this.healthForm.reset()
    this.notificationForm.reset()

    this.healthForm.reset({
      projectId: projectId || ''
    });

    this.isEditMode = false;
    this.healthService.clear();
  }
  onReset() {
    this.notificationForm.reset()
  }
}
