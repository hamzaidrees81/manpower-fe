

import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { DesignationService } from '../../../../@core/services/designation.service';
import { ToasterService } from '../../../../@core/services/toaster.service';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { validateRequiredFields } from '../../../../utils/validation-utils';

@Component({
  selector: 'ngx-project-statistics',
  templateUrl: './project-statistics.component.html',
  styleUrls: ['./project-statistics.component.scss']
})
export class ProjectStatisticsComponent  implements OnInit {
  source: LocalDataSource = new LocalDataSource(); // Table data source

  settings = {
    actions: {
      position: 'right', // Moves action buttons to the right
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
      name: {
        title: 'Name',
        type: 'string',
      },
    },
  };

  constructor(private designationService: DesignationService, private dialogService: NbDialogService, private toasterService: ToasterService) { }

  ngOnInit(): void {
    this.loadDesignations();
  }

  // Load all Designations
  loadDesignations(): void {
    this.designationService.getDesignations().subscribe(
      (data) => {
        this.source.load(data);
      },
      (error) => {
        console.error('Error loading Designations:', error);
      }
    );
  }

  // Add Designation
  onCreateConfirm(event: any): void {
    const newDesignation = event.newData;
    const requiredFields = ["name"];

    // ✅ Validate required fields
    if (!validateRequiredFields(event.newData, requiredFields, this.toasterService)) {
      return; // Stop execution if validation fails
    }
    this.designationService.addDesignation(newDesignation).subscribe(
      (data) => {
        event.confirm.resolve(data);
        this.toasterService.showSuccess('Designation created successfully!');
      },
      (error) => {
        console.error('Error adding Designation:', error);
        this.toasterService.showError('Failed to create designation.');
        event.confirm.reject();
      }
    );
  }

  // Update Designation
  onEditConfirm(event: any): void {
    const requiredFields = ["name"];

    // ✅ Validate required fields
    if (!validateRequiredFields(event.newData, requiredFields, this.toasterService)) {
      return; // Stop execution if validation fails
    }
    const updatedDesignation = event.newData;
    this.designationService.updateDesignation(updatedDesignation.id, updatedDesignation).subscribe(
      (data) => {
        event.confirm.resolve(data);
        this.toasterService.showSuccess('Designation updated successfully!');
      },
      (error) => {
        console.error('Error updating Designation:', error);
        this.toasterService.showError('Failed to updated designation.');
        event.confirm.reject();
      }
    );
  }

  // Delete Designation
  onDeleteConfirm(event: any): void {
    this.dialogService.open(ConfirmDialogComponent, {
      context: {
        title: 'Delete Confirmation',
        message: 'Are you sure you want to delete this Designation?',
      },
    }).onClose.subscribe((confirmed) => {
      if (confirmed) {
        this.designationService.deleteDesignation(event.data.id).subscribe(
          () => {
            event.confirm.resolve();
            this.toasterService.showSuccess('Designation deleted successfully!');
          },
          (error) => {
            console.error('Error deleting Designation:', error);
            event.confirm.reject();
            this.toasterService.showError('Failed to delete Designation.');
          }
        );
      } else {
        event.confirm.reject();
      }
    });
  }
}

