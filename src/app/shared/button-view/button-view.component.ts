import { Component, EventEmitter, Input, Output, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-button-view',
  template: `<div class="d-flex justify-content-center">
    <nb-icon icon="calendar-outline" (click)=onClick()></nb-icon>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush, // ✅ Optimized change detection
})
export class ButtonViewComponent implements OnDestroy {
  @Input() rowData: any;
  @Output() save: EventEmitter<any> = new EventEmitter();

  private subscription: Subscription;
  constructor(private router: Router) { }
  onClick() {
    debugger;
    // Check if 'revenueEarned' key exists in the rowData
    if ('revenueEarned' in this.rowData) {
      // Route to asset stats page
      localStorage.setItem('selectedAssetStats', JSON.stringify(this.rowData));
      this.router.navigate(['/pages/features/asset-statistics-detail']);
    }else if ('activeProjects' in this.rowData) {
      // Route to asset stats page
      localStorage.setItem('selectedProjectStats', JSON.stringify(this.rowData));
      this.router.navigate(['/pages/features/project-statistics-detail']);
    } else {
      // Default route
      localStorage.setItem('selectedPerson', JSON.stringify(this.rowData));
      this.router.navigate(['/pages/features/timesheet']);
    }
    
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe(); // ✅ Prevent memory leaks
    }
  }
}
