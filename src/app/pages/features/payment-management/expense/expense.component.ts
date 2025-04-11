import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { FormatTextPipe } from '../../../../utils/format-text.pipe';
import { ExpenseService } from '../../../../@core/services/expense.service';
import { validateRequiredFields } from '../../../../utils/validation-utils';
import { ToasterService } from '../../../../@core/services/toaster.service';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'ngx-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {

  expenseDataTable: LocalDataSource = new LocalDataSource();

  expenseSetting = {
    actions: false,
    hideSubHeader: true,
    columns: {
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
              { value: 'BILL', title: 'Bill' },
            ]
          }
        }
      },
      amount: { title: 'Amount' },
      expenseMetric: { title: 'Metric' },
    },
  };

  constructor(private expenseService : ExpenseService,private toasterService : ToasterService,private dialogService: NbDialogService){}

  ngOnInit(): void {
    this.loadExpense();
  }

  loadExpense(): void {
    this.expenseService.getExpenses().subscribe(
      (data) => {
        this.expenseDataTable.load(data);
      },
      (error) => {
        console.error('Error loading Sponsors:', error);
      }
    );
  }

    // Add Sponsors
    onCreateConfirm(event: any): void {
      // const numericFields = [ "phone"];
      const requiredFields = [ "name"];
  
      // ✅ Validate required fields
      if (!validateRequiredFields(event.newData, requiredFields, this.toasterService)) {
        return; // Stop execution if validation fails
      }
  
      // if (!validateAndHandleNumericFields(event.newData, numericFields, this.toasterService, event)) {
      //   return; // Stop execution if validation fails
      // }
      const newExpenses = event.newData;
  
      this.expenseService.addExpense(newExpenses).subscribe(
        (data) => {
          event.confirm.resolve(data);
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
      const requiredFields = ["name"];
  
      // ✅ Validate required fields
      if (!validateRequiredFields(event.newData, requiredFields, this.toasterService)) {
        return; // Stop execution if validation fails
      }
  
      // if (!validateAndHandleNumericFields(event.newData, numericFields, this.toasterService, event)) {
      //   return; // Stop execution if validation fails
      // }
      const updatedExpenses = event.newData;
  
      this.expenseService.updateExpense(updatedExpenses.id, updatedExpenses).subscribe(
        (data) => {
          event.confirm.resolve(data);
          this.toasterService.showSuccess('Expense updated successfully!');
        },
        (error) => {
          console.error('Error updating expense:', error);
          this.toasterService.showError('Failed to update expense.');
          event.confirm.reject();
        }
      );
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
