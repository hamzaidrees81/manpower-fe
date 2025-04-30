import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogService } from '@nebular/theme';
import { ToasterService } from '../../../@core/services/toaster.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { validateRequiredFields } from '../../../utils/validation-utils';
import { CategoryService } from '../../../@core/services/pos-services/category.service';

@Component({
  selector: 'ngx-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
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
      categoryName: {
        title: 'Category Name',
        type: 'string',
      },
    },
  };

  constructor(
    private categoryService: CategoryService,
    private dialogService: NbDialogService,
    private toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (data) => this.source.load(data),
      (error) => this.toasterService.showError('Failed to load categories.')
    );
  }

  onCreateConfirm(event: any): void {
    const newCategory = event.newData;
    // const requiredFields = ['categoryName'];

    // if (!validateRequiredFields(newCategory, requiredFields, this.toasterService)) return;

    this.categoryService.addCategory(newCategory).subscribe(
      (data) => {
        event.confirm.resolve(data);
        this.toasterService.showSuccess('Category created successfully!');
      },
      (error) => {
        this.toasterService.showError('Failed to create category.');
        event.confirm.reject();
      }
    );
  }

  onEditConfirm(event: any): void {
    const updatedCategory = event.newData;
    // const requiredFields = ['categoryName'];

    // if (!validateRequiredFields(updatedCategory, requiredFields, this.toasterService)) return;

    this.categoryService.updateCategory(updatedCategory.id, updatedCategory).subscribe(
      (data) => {
        event.confirm.resolve(data);
        this.toasterService.showSuccess('Category updated successfully!');
      },
      (error) => {
        this.toasterService.showError('Failed to update category.');
        event.confirm.reject();
      }
    );
  }

  onDeleteConfirm(event: any): void {
    this.dialogService.open(ConfirmDialogComponent, {
      context: {
        title: 'Delete Confirmation',
        message: 'Are you sure you want to delete this category?',
      },
    }).onClose.subscribe((confirmed) => {
      if (confirmed) {
        this.categoryService.deleteCategory(event.data.id).subscribe(
          () => {
            event.confirm.resolve();
            this.toasterService.showSuccess('Category deleted successfully!');
          },
          (error) => {
            this.toasterService.showError('Failed to delete category.');
            event.confirm.reject();
          }
        );
      } else {
        event.confirm.reject();
      }
    });
  }
}
