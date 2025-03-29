import { Component, Injectable } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class NgxToastrService {

  constructor(private toastr: ToastrService) { }

  success(msg: any, position: any) {
    this.toastr.success('', msg, { positionClass: position });
  }
  error(msg: any, position: any) {
    this.toastr.error('', msg, { positionClass: position });
  }
  warning(msg: any, position: any) {
    this.toastr.warning('', msg, { positionClass: position });
  }
  info(msg: any, position: any) {
    this.toastr.info('', msg, { positionClass: position });
  }
}
