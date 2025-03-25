import { Component, EventEmitter, Input, Output, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-button-view',
  template: `<div class="d-flex justify-content-center">
    <nb-icon icon="eye-outline" (click)=onClick()></nb-icon>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush, // ✅ Optimized change detection
})
export class ButtonViewComponent implements OnDestroy {
  @Input() rowData: any;
  @Output() save: EventEmitter<any> = new EventEmitter();
  
  private subscription: Subscription;
constructor(private router:Router){}
  onClick() {
    localStorage.setItem('selectedPerson', JSON.stringify(this.rowData));
    this.router.navigate(['/pages/features/timesheet']);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe(); // ✅ Prevent memory leaks
    }
  }
}
