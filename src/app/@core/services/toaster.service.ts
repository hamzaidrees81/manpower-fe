import { Injectable } from '@angular/core';
import {
  NbToastrService,
  NbComponentStatus,
  NbGlobalPhysicalPosition,
  NbGlobalPosition
} from '@nebular/theme';

@Injectable({
  providedIn: 'root', // Makes it globally available
})
export class ToasterService {
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  duration = 3000;
  hasIcon = true;
  destroyByClick = true;
  preventDuplicates = false;

  constructor(private toastrService: NbToastrService) {}

  showSuccess(message: string, title: string = 'Success!') {
    this.showToast('success', title, message);
  }

  showError(message: string, title: string = 'Error!') {
    this.showToast('danger', title, message);
  }

  private showToast(type: NbComponentStatus, title: string, body: string) {
    this.toastrService.show(body, title, {
      status: type,
      destroyByClick: this.destroyByClick,
      duration: this.duration,
      hasIcon: this.hasIcon,
      position: this.position,
      preventDuplicates: this.preventDuplicates,
    });
  }
}
