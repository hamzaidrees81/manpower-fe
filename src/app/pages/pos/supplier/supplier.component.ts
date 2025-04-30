import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogService } from '@nebular/theme';
import { ToasterService } from '../../../@core/services/toaster.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { validateRequiredFields } from '../../../utils/validation-utils';
import { SupplierService } from '../../../@core/services/pos-services/supplier.service';

@Component({
  selector: 'ngx-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();

  settings = {
    actions: {
      position: 'right',
      add:false
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
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
      address: {
        title: 'Address',
        type: 'string',
        filter:false
      },
      contact: {
        title: 'Contact',
        type: 'string',
        filter:false
      },
      comments: {
        title: 'Comments',
        type: 'string',
        filter:false
      },
    },
  };

  constructor(
    private supplierService: SupplierService,
    private dialogService: NbDialogService,
    private toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  // Load all suppliers
  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe(
      (data) => this.source.load(data),
      (error) => {
        console.error('Error loading suppliers:', error);
        this.toasterService.showError('Failed to load suppliers.');
      }
    );
  }

  // Add supplier
  onCreateConfirm(event: any): void {
    const newSupplier = event.newData;
    // const requiredFields = ['name', 'phone'];

    // if (!validateRequiredFields(newSupplier, requiredFields, this.toasterService)) {
    //   return;
    // }

    this.supplierService.addSupplier(newSupplier).subscribe(
      (data) => {
        event.confirm.resolve(data);
        this.toasterService.showSuccess('Supplier added successfully!');
      },
      (error) => {
        console.error('Error adding supplier:', error);
        this.toasterService.showError('Failed to add supplier.');
        event.confirm.reject();
      }
    );
  }

  // Update supplier
  onEditConfirm(event: any): void {
    const updatedSupplier = event.newData;
    // const requiredFields = ['name', 'phone'];

    // if (!validateRequiredFields(updatedSupplier, requiredFields, this.toasterService)) {
    //   return;
    // }

    this.supplierService.updateSupplier(updatedSupplier.id, updatedSupplier).subscribe(
      (data) => {
        event.confirm.resolve(data);
        this.toasterService.showSuccess('Supplier updated successfully!');
      },
      (error) => {
        console.error('Error updating supplier:', error);
        this.toasterService.showError('Failed to update supplier.');
        event.confirm.reject();
      }
    );
  }

  // Delete supplier
  onDeleteConfirm(event: any): void {
    this.dialogService.open(ConfirmDialogComponent, {
      context: {
        title: 'Delete Confirmation',
        message: 'Are you sure you want to delete this supplier?',
      },
    }).onClose.subscribe((confirmed) => {
      if (confirmed) {
        this.supplierService.deleteSupplier(event.data.id).subscribe(
          () => {
            event.confirm.resolve();
            this.toasterService.showSuccess('Supplier deleted successfully!');
          },
          (error) => {
            console.error('Error deleting supplier:', error);
            this.toasterService.showError('Failed to delete supplier.');
            event.confirm.reject();
          }
        );
      } else {
        event.confirm.reject();
      }
    });
  }
}
