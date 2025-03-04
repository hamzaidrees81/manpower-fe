

import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { DesignationService } from '../../../@core/services/designation.service';

@Component({
  selector: 'ngx-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.scss']
})
export class DesignationComponent  implements OnInit {
  source: LocalDataSource = new LocalDataSource(); // Table data source

  settings = {
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

  constructor(private designationService: DesignationService) {}

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
    this.designationService.addDesignation(newDesignation).subscribe(
      (data) => {
        event.confirm.resolve(data);
      },
      (error) => {
        console.error('Error adding Designation:', error);
        event.confirm.reject();
      }
    );
  }

  // Update Designation
  onEditConfirm(event: any): void {
    const updatedDesignation = event.newData;
    this.designationService.updateDesignation(updatedDesignation.id, updatedDesignation).subscribe(
      (data) => {
        event.confirm.resolve(data);
      },
      (error) => {
        console.error('Error updating Designation:', error);
        event.confirm.reject();
      }
    );
  }

  // Delete Designation
  onDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to delete this Designation?')) {
      this.designationService.deleteDesignation(event.data.id).subscribe(
        () => {
          event.confirm.resolve();
        },
        (error) => {
          console.error('Error deleting Designation:', error);
          event.confirm.reject();
        }
      );
    } else {
      event.confirm.reject();
    }
  }
}

