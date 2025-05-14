

import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { ToasterService } from '../../../../@core/services/toaster.service';
import { DashboardService } from '../../../../@core/services/dashboard.service';
import { FormatTextPipe } from '../../../../utils/format-text.pipe';
import { ButtonViewComponent } from '../../../../shared/button-view/button-view.component';

@Component({
  selector: 'ngx-asset-statistics',
  templateUrl: './asset-statistics.component.html',
  styleUrls: ['./asset-statistics.component.scss']
})
export class AssetStatisticsComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource(); // Table data source
  settings = {
    actions: {
      position: 'right', // Moves action buttons to the right
      add:false,
      edit:false,
      delete:false
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true, // Enable confirmation on add
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true, // Enable confirmation on edit
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
            button: {
              title: 'View Detail',
              type: 'custom',
              filter: false,
              editable: false,
              addable: false,
              renderComponent: ButtonViewComponent,
              onComponentInitFunction(instance) {
                const sub = instance.save.subscribe(row => {
                });
      
                // ✅ Prevent memory leaks by unsubscribing
                instance.ngOnDestroy = () => sub.unsubscribe();
              }
            },
      assetName: {
        title: 'Asset Name',
        type: 'string',
      },
      status: {
        title: 'Status',
        type: 'string',
        filter:false,
        valuePrepareFunction: (value) => new FormatTextPipe().transform(value), 
      },
      activeProjects: {
        title: 'Active Projects',
        type: 'number',
        filter:false
      },
      revenueEarned: {
        title: 'Revenue (Earned)',
        type: 'number',
        filter:false
      },
      expenses: {
        title: 'Expenses',
        type: 'number',
        filter:false
      },
      profitFromAsset: {
        title: 'Profit',
        type: 'number',
        filter:false
      },
      // lastUsed: {
      //   title: 'Last Used',
      //   type: 'string',
      //   filter:false
      // },
    },
  };
  

  constructor(private dashboardService: DashboardService, private dialogService: NbDialogService, private toasterService: ToasterService) { }

  ngOnInit(): void {
    this.loadAssetStats();
  }

  // Load all AssetStats
  loadAssetStats(): void {
    this.dashboardService.getAssetsStats().subscribe(
      (data) => {
        this.source.load(data);
      },
      (error) => {
        console.error('Error loading Asset Stats:', error);
      }
    );
  }

  // Add Designation
  // onCreateConfirm(event: any): void {
  //   const newDesignation = event.newData;
  //   const requiredFields = ["name"];

  //   // ✅ Validate required fields
  //   if (!validateRequiredFields(event.newData, requiredFields, this.toasterService)) {
  //     return; // Stop execution if validation fails
  //   }
  //   this.dashboardService.addDesignation(newDesignation).subscribe(
  //     (data) => {
  //       event.confirm.resolve(data);
  //       this.toasterService.showSuccess('Designation created successfully!');
  //     },
  //     (error) => {
  //       console.error('Error adding Designation:', error);
  //       this.toasterService.showError('Failed to create designation.');
  //       event.confirm.reject();
  //     }
  //   );
  // }

  // Update Designation
  // onEditConfirm(event: any): void {
  //   const requiredFields = ["name"];

  //   // ✅ Validate required fields
  //   if (!validateRequiredFields(event.newData, requiredFields, this.toasterService)) {
  //     return; // Stop execution if validation fails
  //   }
  //   const updatedDesignation = event.newData;
  //   this.dashboardService.updateDesignation(updatedDesignation.id, updatedDesignation).subscribe(
  //     (data) => {
  //       event.confirm.resolve(data);
  //       this.toasterService.showSuccess('Designation updated successfully!');
  //     },
  //     (error) => {
  //       console.error('Error updating Designation:', error);
  //       this.toasterService.showError('Failed to updated designation.');
  //       event.confirm.reject();
  //     }
  //   );
  // }

  // Delete Designation
  // onDeleteConfirm(event: any): void {
  //   this.dialogService.open(ConfirmDialogComponent, {
  //     context: {
  //       title: 'Delete Confirmation',
  //       message: 'Are you sure you want to delete this Designation?',
  //     },
  //   }).onClose.subscribe((confirmed) => {
  //     if (confirmed) {
  //       this.dashboardService.deleteDesignation(event.data.id).subscribe(
  //         () => {
  //           event.confirm.resolve();
  //           this.toasterService.showSuccess('Designation deleted successfully!');
  //         },
  //         (error) => {
  //           console.error('Error deleting Designation:', error);
  //           event.confirm.reject();
  //           this.toasterService.showError('Failed to delete Designation.');
  //         }
  //       );
  //     } else {
  //       event.confirm.reject();
  //     }
  //   });
  // }
}

