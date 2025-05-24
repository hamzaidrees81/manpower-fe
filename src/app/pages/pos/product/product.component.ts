import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogService } from '@nebular/theme';
import { ToasterService } from '../../../@core/services/toaster.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { validateRequiredFields } from '../../../utils/validation-utils';
import { ProductService } from '../../../@core/services/pos-services/product.service';
import { BrandService } from '../../../@core/services/pos-services/brand.service';
import { CategoryService } from '../../../@core/services/pos-services/category.service';

@Component({
  selector: 'ngx-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();

  settings = {
    actions: { position: 'right' },
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
      namePrint: {
        title: 'Name (Print)',
        type: 'string',
        filter:false,
      },
      namePrintAr: {
        title: 'Name (Arabic)',
        type: 'string',
        filter:false,
      },
      code: {
        title: 'Code',
        type: 'string',
        filter:false,
      },
      productCode: {
        title: 'Product Code',
        type: 'string',
        filter:false,
      },
      productType: {
        title: 'Type',
        type: 'string',
        filter:false,
      },
      comments: {
        title: 'Comments',
        type: 'string',
        filter:false,
      },
      active: {
        title: 'Status',
        type: 'html',
        filter:false,
        editor: {
          type: 'list',
          config: {
            list: [
              { value: 'ACTIVE', title: 'Active' },
              { value: 'INACTIVE', title: 'Inactive' },
            ],
          },
        },
        valuePrepareFunction: (value) => value === 'ACTIVE' ? 'Active' : 'Inactive',
      },
      categoryId: {
        title: 'Category',
        type: 'html',
        filter:false,
        editor: {
          type: 'list',
          config: {
            list: [],
          },
        },
        valuePrepareFunction: (value) => {
          const found = this.categories.find(c => c.id === value);
          return found ? found.categoryName : value;
        },
      },
      brandId: {
        title: 'Brand',
        type: 'html',
        filter:false,
        editor: {
          type: 'list',
          config: {
            list: [],
          },
        },
        valuePrepareFunction: (value) => {
          const found = this.brands.find(b => b.id === value);
          return found ? found.brandName : value;
        },
      },
       sellingPrice: {
        title: 'Selling Price',
        type: 'string',
        filter:false,
      },
       stockQty: {
        title: 'Stock QTY',
        type: 'string',
        filter:false,
      },
    }
    
  };
  brands;
  categories;

  constructor(
    private productService: ProductService,
    private dialogService: NbDialogService,
    private toasterService: ToasterService,
    private brandService : BrandService,
    private categoryService : CategoryService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadDropdowns();
  }

  loadDropdowns() {
    this.brandService.getBrands().subscribe((data) => {
      this.brands = data;
      this.settings = {
        ...this.settings,
        columns: {
          ...this.settings.columns,
          brandId: {
            ...this.settings.columns.brandId,
            editor: {
              type: 'list',
              config: {
                list: data.map((c) => ({
                  value: c.id, // Store full object as string if needed
                  title: c.brandName,
                })),
              },
            },
          },
        },
      };
    });
  
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
      this.settings = {
        ...this.settings,
        columns: {
          ...this.settings.columns,
          categoryId: {
            ...this.settings.columns.categoryId,
            editor: {
              type: 'list',
              config: {
                list: data.map((c) => ({
                  value: c.id,
                  title: c.categoryName,
                })),
              },
            },
          },
        },
      };
    });
  }
  

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (data) => this.source.load(data),
      (error) => this.toasterService.showError('Failed to load products.')
    );
  }

  onCreateConfirm(event: any): void {
    const newProduct = event.newData;
    // const requiredFields = ['productName'];

    // if (!validateRequiredFields(newProduct, requiredFields, this.toasterService)) return;

    this.productService.addProduct(newProduct).subscribe(
      (data) => {
        event.confirm.resolve(data);
        this.toasterService.showSuccess('Product created successfully!');
      },
      (error) => {
        this.toasterService.showError('Failed to create product.');
        event.confirm.reject();
      }
    );
  }

  onEditConfirm(event: any): void {
    const updatedProduct = event.newData;
    // const requiredFields = ['productName'];

    // if (!validateRequiredFields(updatedProduct, requiredFields, this.toasterService)) return;

    this.productService.updateProduct(updatedProduct.id, updatedProduct).subscribe(
      (data) => {
        event.confirm.resolve(data);
        this.toasterService.showSuccess('Product updated successfully!');
      },
      (error) => {
        this.toasterService.showError('Failed to update product.');
        event.confirm.reject();
      }
    );
  }

  onDeleteConfirm(event: any): void {
    this.dialogService.open(ConfirmDialogComponent, {
      context: {
        title: 'Delete Confirmation',
        message: 'Are you sure you want to delete this product?',
      },
    }).onClose.subscribe((confirmed) => {
      if (confirmed) {
        this.productService.deleteProduct(event.data.id).subscribe(
          () => {
            event.confirm.resolve();
            this.toasterService.showSuccess('Product deleted successfully!');
          },
          (error) => {
            this.toasterService.showError('Failed to delete product.');
            event.confirm.reject();
          }
        );
      } else {
        event.confirm.reject();
      }
    });
  }
}
