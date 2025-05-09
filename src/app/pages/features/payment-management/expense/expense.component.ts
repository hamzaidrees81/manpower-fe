import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { FormatTextPipe } from '../../../../utils/format-text.pipe';
import { ExpenseService } from '../../../../@core/services/expense.service';
import { validateRequiredFields } from '../../../../utils/validation-utils';
import { ToasterService } from '../../../../@core/services/toaster.service';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { NbDialogService } from '@nebular/theme';
import { AssetService } from '../../../../@core/services/asset.service';
import { ProjectService } from '../../../../@core/services/projects.service';
import { Router } from '@angular/router';
import { AccountsService } from '../../../../@core/services/accounts.service';
import { SmartTableDatepickerRenderComponentComponent } from '../../../../shared/smart-table-datepicker-render-component/smart-table-datepicker-render-component.component';
import { CustomDatepickerComponent } from '../../../../shared/custom-datepicker/custom-datepicker.component';

@Component({
  selector: 'ngx-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {

  expenseDataTable: LocalDataSource = new LocalDataSource();

  getCategorysList;
  getProjectsList;
  getAssetsList;
  selectedAssetId;

  selectedCategoryByName;
  selectedProjectByName;
  selectedAssetByName;

  amount: number | null = null;
  remarks: string = '';
  mainAccountId;
  categoryId;
  paymentDate: Date = new Date();
  paymentMethod: { label: string; value: string } | null = null;
  reference: string = '';
  paymentType: { label: string; value: string } | null = null;

  historyTableData: LocalDataSource = new LocalDataSource();
  historyTableSettings = {
    actions: {
      add: false,
      position: 'right',
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
      paidToName: {
        title: 'Name',
        type: 'string',
        filter: false
      },
      mainAccountName: {
        title: 'Account Name',
        type: 'string',
        filter: false
      },
      paymentDate: {
          title: 'Payment Date',
          type: 'custom',
          renderComponent: SmartTableDatepickerRenderComponentComponent,
          filter: false,
          editor: {
            type: 'custom',
            component: CustomDatepickerComponent,
          }
        },
      reference: {
        title: 'Reference',
        type: 'string',
        filter: false
      },
      remarks: {
        title: 'Remarks',
        type: 'string',
        filter: false
      },
      paymentMethod: {
        title: 'Method',
        type: 'string',
        filter: false,
        valuePrepareFunction: (value) => new FormatTextPipe().transform(value),
      },
      paymentType: {
        title: 'Type',
        type: 'string',
        filter: false,
        valuePrepareFunction: (value) => new FormatTextPipe().transform(value),
      },
      amount: {
        title: 'Amount',
        type: 'number',
        filter: false
      },
    }
  };

  showHistoryTable = false;

  expenseSetting = {
    actions: false,
    hideSubHeader: true,
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
      assetName: {
        title: 'Asset Name',
        type: 'html',
        valuePrepareFunction: (asset) => asset.name ,
        editor: {
          type: 'list',
          config: {
            selectText: 'Select...',
            list: [],
          },
        },
      },
      expenseType: {
        title: 'Type',
        filter: false,
        type: 'string',
        valuePrepareFunction: (value) => new FormatTextPipe().transform(value),
        editor: {
          type: 'list',
          config: {
            selectText: 'Select...',
            list: [
              { value: 'PROJECT', title: 'Project' },
              { value: 'SELF', title: 'Self' } // assuming more types
            ]
          }
        }
      },
      expenseProjectName: {
        title: 'Project Name',
        type: 'html',
        valuePrepareFunction: (project) => project.name ,
        editor: {
          type: 'list',
          config: {
            selectText: 'Select...',
            list: [],
          },
        },
      },
      expenseMetric: {
        title: 'Metric',
        type: 'string',
        filter: false,
      },
      expenseCategoryName: {
        title: 'Category Name',
        type: 'html',
        valuePrepareFunction: (category) => category.name ,
        editor: {
          type: 'list',
          config: {
            selectText: 'Select...',
            list: [],
          },
        },
      },
      amount: {
        title: 'Amount',
        type: 'number',
        filter: false,
      },
      comment: {
        title: 'Comment',
        type: 'string',
        filter: false,
      }
    }
  };
  getExpenseList;

  paymentMethods = [
    { key: 'BANK_TRANSFER', label: 'Bank Transfer' },
    { key: 'CASH', label: 'Cash' },
    { key: 'CHEQUE', label: 'Cheque' },
    { key: 'ONLINE_TRANSFER', label: 'Online Transfer' },
    { key: 'CREDIT_CARD', label: 'Credit Card' },
    { key: 'DEBIT_CARD', label: 'Debit Card' },
    { key: 'MOBILE_WALLET', label: 'Mobile Wallet' },
    { key: 'OTHER', label: 'Other' }
  ];
  
  paymentTypes = [
    { key: 'INITIAL', label: 'Initial' },
    { key: 'ADJUSTMENT', label: 'Adjustment' },
    { key: 'FULL', label: 'Full' },
    { key: 'REFUND', label: 'Refund' },
    { key: 'ADVANCE', label: 'Advance' }
  ];
  getAccounts: any[];
  

  constructor(private accountsService : AccountsService ,private router : Router ,private expenseService : ExpenseService,private toasterService : ToasterService,private dialogService: NbDialogService,private assetService : AssetService,private projectService : ProjectService){}

  ngOnInit(): void {
    this.loadDropdowns();
    // this.loadExpense();
    this.getHistory();
    this.loadAccount();
  }

  loadAccount() {
    this.accountsService.getAccounts().subscribe(
      (data) => {
        this.getAccounts = data;
      },
      (error) => {
        console.error('Error loading sponsors:', error);
      }
    );
  }

  onPay(): void {

    const paymentPayload = {
      paidToType:"EXPENSE",
      paidToId:this.selectedAssetId,
      amount: this.amount,
      invoiceId:this.categoryId?.id,
      mainAccountId:this.mainAccountId,
      remarks: this.remarks,
      paymentDate: this.paymentDate ? this.paymentDate.toISOString() : null,
      paymentMethod: this.paymentMethod,
      reference: this.reference,
      status:"COMPLETED",
      paymentType: this.paymentType
    };
    this.expenseService.addPayment(paymentPayload).subscribe(
      (data) => {
        this.toasterService.showSuccess('Payment paid successfully!');
        this.showHistoryTable = true;
        this.getHistory();
  
        // Optionally reset form fields
        this.resetForm();
      },
      (error) => {
        console.error('Error adding payment:', error);
        this.toasterService.showError('Failed to create payment.');
      }
    );
  }

  getHistory(){
   const paidToType = "EXPENSE";
    this.expenseService.getPaymentsByFilter(this.selectedAssetByName,paidToType).subscribe(
      (data) => {
        this.historyTableData.load(data);
      },
      (error) => {
        console.error('Error loading projects:', error);
      }
    );
  }
  
  resetForm(): void {
    this.amount = null;
    this.remarks = '';
    this.paymentDate = null;
    this.paymentMethod = null;
    this.reference = '';
    this.paymentType = null;
  }

  loadDropdowns(): void {
    this.assetService.getAssetsByCompany().subscribe((data) => {
      
      this.getAssetsList = data;
      // this.expenseSetting = {
      //   ...this.expenseSetting,
      //   columns: {
      //     ...this.expenseSetting.columns,
      //     assetName: {
      //       ...this.expenseSetting.columns.assetName,
      //       editor: {
      //         type: 'list',
      //         config: {
      //           selectText: 'Select...',
      //           list: data.map((c) => ({
      //             value: JSON.stringify(c), // Store whole object as string
      //             title: c.name, // Display name
      //           })),
      //         },
      //       },
      //     },
      //   },
      // };
    });

    this.projectService.getProjects().subscribe((data) => {
      
      this.getProjectsList = data;
      // this.expenseSetting = {
      //   ...this.expenseSetting,
      //   columns: {
      //     ...this.expenseSetting.columns,
      //     expenseProjectName: {
      //       ...this.expenseSetting.columns.expenseProjectName,
      //       editor: {
      //         type: 'list',
      //         config: {
      //           selectText: 'Select...',
      //           list: data.map((c) => ({
      //             value: JSON.stringify(c), // Store whole object as string
      //             title: c.name, // Display name
      //           })),
      //         },
      //       },
      //     },
      //   },
      // };
    });

    this.expenseService.getCategories().subscribe((data) => {
      this.getCategorysList = data;
      // this.expenseSetting = {
      //   ...this.expenseSetting,
      //   columns: {
      //     ...this.expenseSetting.columns,
      //     expenseCategoryName: {
      //       ...this.expenseSetting.columns.expenseCategoryName,
      //       editor: {
      //         type: 'list',
      //         config: {
      //           selectText: 'Select...',
      //           list: data.map((c) => ({
      //             value: JSON.stringify(c), // Store whole object as string
      //             title: c.categoryName, // Display name
      //           })),
      //         },
      //       },
      //     },
      //   },
      // };
    });
  }

  loadExpense(): void {
    this.expenseService.getExpenses().subscribe(
      (data) => {
        this.getExpenseList = data;
        const updatedList = this.getExpenseList?.map(item => ({
          ...item,
          assetName: {
            id: item.assetId,
            name: item.assetName
          },
          expenseCategoryName: {
            id: item.expenseCategoryId,
            name: item.expenseCategoryName
          },
          expenseProjectName: {
            id: item.expenseProjectId,
            name: item.expenseProjectName
          }
        }));
        this.expenseDataTable.load(updatedList);
      },
      (error) => {
        console.error('Error loading Sponsors:', error);
      }
    );
  }

  toggleDetails() {
    if (this.selectedAssetByName || this.selectedProjectByName || this.selectedCategoryByName) {
      this.fetchExpenses(this.selectedAssetByName?.id , this.selectedProjectByName?.id, this.selectedCategoryByName?.id);
    }
  }

  fetchExpenses(assetId,projectId?,categoryId?): void {
    this.expenseService.getExpenseByAssetName(assetId,projectId,categoryId,).subscribe(
      (data) => {
        this.getExpenseList = data;
        const updatedList = this.getExpenseList?.map(item => ({
          ...item,
          assetName: {
            id: item.assetId,
            name: item.assetName
          },
          expenseCategoryName: {
            id: item.expenseCategoryId,
            categoryName: item.expenseCategoryName
          },
          expenseProjectName: {
            id: item.expenseProjectId,
            name: item.expenseProjectName
          }
        }));
        this.expenseDataTable.load(updatedList);
      },
      (error) => {
        console.error('Error loading invoices:', error);
      }
    );
  }

    // Add Sponsors
    onCreateConfirm(event: any): void {
      // const numericFields = [ "phone"];
      // const requiredFields = [ "name"];
  
      // ✅ Validate required fields
      // if (!validateRequiredFields(event.newData, requiredFields, this.toasterService)) {
      //   return; // Stop execution if validation fails
      // }
  
      // if (!validateAndHandleNumericFields(event.newData, numericFields, this.toasterService, event)) {
      //   return; // Stop execution if validation fails
      // }
      const newExpenses = event.newData;
      const projectId = JSON.parse(newExpenses?.expenseProjectName);
      const categoryId = JSON.parse(newExpenses?.expenseCategoryName);
      const assetId = JSON.parse(newExpenses?.assetName);
      const updateData = {
        ...newExpenses,
        expenseProjectId : projectId?.id,
        expenseCategoryId : categoryId?.id,
        assetId : assetId?.id,
      }

      delete newExpenses?.assetName;
      delete newExpenses?.expenseProjectName;
      delete newExpenses?.expenseCategoryName;
  
      this.expenseService.addExpense(updateData).subscribe(
        (data) => {
          // event.confirm.resolve(data);
          this.reloadCurrentRoute();
          this.toasterService.showSuccess('Expense created successfully!');
        },
        (error) => {
          console.error('Error adding Expense:', error);
          this.toasterService.showError('Failed to create expense.');
          event.confirm.reject();
        }
      );
    }
  
    // Update Expenses
    onEditConfirm(event: any): void {
      // const numericFields = ["phone"];
      // const requiredFields = ["name"];
  
      // ✅ Validate required fields
      // if (!validateRequiredFields(event.newData, requiredFields, this.toasterService)) {
      //   return; // Stop execution if validation fails
      // }
  
      // if (!validateAndHandleNumericFields(event.newData, numericFields, this.toasterService, event)) {
      //   return; // Stop execution if validation fails
      // }
      const updatedExpenses = event.newData;
      const projectId = JSON.parse(updatedExpenses?.expenseProjectName);
      const categoryId = JSON.parse(updatedExpenses?.expenseCategoryName);
      const assetId = JSON.parse(updatedExpenses?.assetName);
      const updateData = {
        ...updatedExpenses,
        expenseProjectId : projectId?.id,
        expenseCategoryId : categoryId?.id,
        assetId : assetId?.id,
      }

      delete updatedExpenses?.assetName;
      delete updatedExpenses?.expenseProjectName;
      delete updatedExpenses?.expenseCategoryName;
  
      this.expenseService.updateExpense(updateData.id, updateData).subscribe(
        (data) => {
          // event.confirm.resolve(data);
          this.reloadCurrentRoute();
          this.toasterService.showSuccess('Expense updated successfully!');
        },
        (error) => {
          console.error('Error updating expense:', error);
          this.toasterService.showError('Failed to update expense.');
          event.confirm.reject();
        }
      );
    }

    reloadCurrentRoute(): void {
      const currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
    }
  
    // Delete Expenses
    onDeleteConfirm(event: any): void {
      this.dialogService.open(ConfirmDialogComponent, {
        context: {
          title: 'Delete Confirmation',
          message: 'Are you sure you want to delete this expense?',
        },
      }).onClose.subscribe((confirmed) => {
        if (confirmed) {
          this.expenseService.deleteExpense(event.data.id).subscribe(
            () => {
              event.confirm.resolve();
              this.toasterService.showSuccess('Expense deleted successfully!');
            },
            (error) => {
              console.error('Error deleting expense:', error);
              event.confirm.reject();
              this.toasterService.showError('Failed to delete expense.');
            }
          );
        } else {
          event.confirm.reject();
        }
      });
    }
}
