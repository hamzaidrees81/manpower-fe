import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogService } from '@nebular/theme';
import { ToasterService } from '../../../@core/services/toaster.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { ShopService } from '../../../@core/services/pos-services/shop.service'; // Adjust path as needed

@Component({
  selector: 'ngx-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();

  settings = {
    actions: {
      position: 'right',
      add: false
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
      shopName: {
        title: 'Shop Name',
        type: 'string',
      },
      shopAddress: {
        title: 'Address',
        type: 'string',
        filter: false,
      },
      shopPhone1: {
        title: 'Phone 1',
        type: 'string',
        filter: false,
      },
      shopPhone2: {
        title: 'Phone 2',
        type: 'string',
        filter: false,
      },
      comments: {
        title: 'Comments',
        type: 'string',
        filter: false,
      },
      status: {
        title: 'Status',
        type: 'string',
        filter: false,
      }
    },
  };

  constructor(
    private shopService: ShopService,
    private dialogService: NbDialogService,
    private toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    this.loadShops();
  }

  loadShops(): void {
    this.shopService.getShops().subscribe(
      data => this.source.load(data),
      error => {
        console.error('Error loading shops:', error);
        this.toasterService.showError('Failed to load shops.');
      }
    );
  }

  onCreateConfirm(event: any): void {
    const newShop = event.newData;

    this.shopService.addShop(newShop).subscribe(
      data => {
        event.confirm.resolve(data);
        this.toasterService.showSuccess('Shop added successfully!');
      },
      error => {
        console.error('Error adding shop:', error);
        this.toasterService.showError('Failed to add shop.');
        event.confirm.reject();
      }
    );
  }

  onEditConfirm(event: any): void {
    const updatedShop = event.newData;

    this.shopService.updateShop(updatedShop.id, updatedShop).subscribe(
      data => {
        event.confirm.resolve(data);
        this.toasterService.showSuccess('Shop updated successfully!');
      },
      error => {
        console.error('Error updating shop:', error);
        this.toasterService.showError('Failed to update shop.');
        event.confirm.reject();
      }
    );
  }

  onDeleteConfirm(event: any): void {
    this.dialogService.open(ConfirmDialogComponent, {
      context: {
        title: 'Delete Confirmation',
        message: 'Are you sure you want to delete this shop?',
      },
    }).onClose.subscribe((confirmed) => {
      if (confirmed) {
        this.shopService.deleteShop(event.data.id).subscribe(
          () => {
            event.confirm.resolve();
            this.toasterService.showSuccess('Shop deleted successfully!');
          },
          (error) => {
            console.error('Error deleting shop:', error);
            this.toasterService.showError('Failed to delete shop.');
            event.confirm.reject();
          }
        );
      } else {
        event.confirm.reject();
      }
    });
  }
}
