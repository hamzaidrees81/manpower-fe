import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogService } from '@nebular/theme';
import { ToasterService } from '../../../@core/services/toaster.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { validateRequiredFields } from '../../../utils/validation-utils';
import { BrandService } from '../../../@core/services/pos-services/brand.service';

@Component({
  selector: 'ngx-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();

  settings = {
    actions: {
      position: 'right',
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
      brandName: {
        title: 'Name',
        type: 'string',
      },
    },
  };

  constructor(
    private brandService: BrandService,
    private dialogService: NbDialogService,
    private toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.brandService.getBrands().subscribe(
      (data) => {
        this.source.load(data);
      },
      (error) => {
        console.error('Error loading brands:', error);
        this.toasterService.showError('Failed to load brands.');
      }
    );
  }

  onCreateConfirm(event: any): void {
    const newBrand = event.newData;
    const requiredFields = ['brandName'];

    if (!validateRequiredFields(newBrand, requiredFields, this.toasterService)) {
      return;
    }

    this.brandService.addBrand(newBrand).subscribe(
      (data) => {
        event.confirm.resolve(data);
        this.toasterService.showSuccess('Brand created successfully!');
      },
      (error) => {
        console.error('Error adding brand:', error);
        this.toasterService.showError('Failed to create brand.');
        event.confirm.reject();
      }
    );
  }

  onEditConfirm(event: any): void {
    const updatedBrand = event.newData;
    const requiredFields = ['brandName'];

    if (!validateRequiredFields(updatedBrand, requiredFields, this.toasterService)) {
      return;
    }

    this.brandService.updateBrand(updatedBrand.id, updatedBrand).subscribe(
      (data) => {
        event.confirm.resolve(data);
        this.toasterService.showSuccess('Brand updated successfully!');
      },
      (error) => {
        console.error('Error updating brand:', error);
        this.toasterService.showError('Failed to update brand.');
        event.confirm.reject();
      }
    );
  }

  onDeleteConfirm(event: any): void {
    this.dialogService.open(ConfirmDialogComponent, {
      context: {
        title: 'Delete Confirmation',
        message: 'Are you sure you want to delete this brand?',
      },
    }).onClose.subscribe((confirmed) => {
      if (confirmed) {
        this.brandService.deleteBrand(event.data.id).subscribe(
          () => {
            event.confirm.resolve();
            this.toasterService.showSuccess('Brand deleted successfully!');
          },
          (error) => {
            console.error('Error deleting brand:', error);
            this.toasterService.showError('Failed to delete brand.');
            event.confirm.reject();
          }
        );
      } else {
        event.confirm.reject();
      }
    });
  }
}
