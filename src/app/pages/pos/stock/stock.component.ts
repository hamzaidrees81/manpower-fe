import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogService } from '@nebular/theme';
import { ToasterService } from '../../../@core/services/toaster.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { validateRequiredFields } from '../../../utils/validation-utils';
import { StockService } from '../../../@core/services/pos-services/stock.service';
import { ProductService } from '../../../@core/services/pos-services/product.service';
import { SupplierService } from '../../../@core/services/pos-services/supplier.service';

@Component({
  selector: 'ngx-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();

  settings = {
    actions: false,
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
      productId: {
        title: 'Product',
        type: 'html',
        filter: false,
        valuePrepareFunction: (product) => product?.name,
        editor: {
          type: 'list',
          config: {
            selectText: 'Select...',
            list: [],
          },
        },
      },
      supplierId: {
        title: 'Supplier',
        type: 'html',
        filter: false,
        valuePrepareFunction: (supplier) => supplier?.name,
        editor: {
          type: 'list',
          config: {
            selectText: 'Select...',
            list: [],
          },
        },
      },
       shopId: {
        title: 'Shop',
        type: 'html',
        filter: false,
        valuePrepareFunction: (shop) => shop?.name,
        editor: {
          type: 'list',
          config: {
            selectText: 'Select...',
            list: [],
          },
        },
      },
      quantity: {
        title: 'Quantity',
        type: 'number',
        filter:false,
      },
      retailPrice: {
        title: 'Price',
        type: 'number',
        filter:false,
      },
       minPrice: {
        title: 'Min Price',
        type: 'string',
        filter:false,
      },
       buyPrice: {
        title: 'Buy Price',
        type: 'string',
        filter:false,
      },
       storageRack: {
        title: 'Storage Rack',
        type: 'string',
        filter:false,
      },
    },
  };
  products: any[];
  suppliers: any[];

  constructor(
    private stockService: StockService,
    private dialogService: NbDialogService,
    private toasterService: ToasterService,
    private productService: ProductService,
    private supplierService : SupplierService
  ) {}

  ngOnInit(): void {
    this.loadStocks();
    this.loadDropdowns();
  }

  loadDropdowns(){
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      this.settings = {
        ...this.settings,
        columns: {
          ...this.settings.columns,
          productId: {
            ...this.settings.columns.productId,
            editor: {
              type: 'list',
              config: {
                selectText: 'Select...',
                list: data.map((c) => ({
                  value: JSON.stringify(c), // Store whole object as string
                  title: c.name, // Display name
                })),
              },
            },
          },
        },
      };
    });
    this.supplierService.getSuppliers().subscribe((data) => {
      this.suppliers = data;
      this.settings = {
        ...this.settings,
        columns: {
          ...this.settings.columns,
          supplierId: {
            ...this.settings.columns.supplierId,
            editor: {
              type: 'list',
              config: {
                selectText: 'Select...',
                list: data.map((c) => ({
                  value: JSON.stringify(c), // Store whole object as string
                  title: c.name, // Display name
                })),
              },
            },
          },
        },
      };
    });
  }

  loadStocks(): void {
    this.stockService.getStocks().subscribe(
      (data) => this.source.load(data),
      (error) => this.toasterService.showError('Failed to load stocks.')
    );
  }

  onCreateConfirm(event: any): void {
    const newStock = event.newData;
    // const requiredFields = ['stockName'];

    // if (!validateRequiredFields(newStock, requiredFields, this.toasterService)) return;

    this.stockService.addStock(newStock).subscribe(
      (data) => {
        event.confirm.resolve(data);
        this.toasterService.showSuccess('Stock created successfully!');
      },
      (error) => {
        this.toasterService.showError('Failed to create stock.');
        event.confirm.reject();
      }
    );
  }

  onEditConfirm(event: any): void {
    const updatedStock = event.newData;
    const requiredFields = ['stockName'];

    if (!validateRequiredFields(updatedStock, requiredFields, this.toasterService)) return;

    this.stockService.updateStock(updatedStock.id, updatedStock).subscribe(
      (data) => {
        event.confirm.resolve(data);
        this.toasterService.showSuccess('Stock updated successfully!');
      },
      (error) => {
        this.toasterService.showError('Failed to update stock.');
        event.confirm.reject();
      }
    );
  }

  onDeleteConfirm(event: any): void {
    this.dialogService.open(ConfirmDialogComponent, {
      context: {
        title: 'Delete Confirmation',
        message: 'Are you sure you want to delete this stock?',
      },
    }).onClose.subscribe((confirmed) => {
      if (confirmed) {
        this.stockService.deleteStock(event.data.id).subscribe(
          () => {
            event.confirm.resolve();
            this.toasterService.showSuccess('Stock deleted successfully!');
          },
          (error) => {
            this.toasterService.showError('Failed to delete stock.');
            event.confirm.reject();
          }
        );
      } else {
        event.confirm.reject();
      }
    });
  }
}
