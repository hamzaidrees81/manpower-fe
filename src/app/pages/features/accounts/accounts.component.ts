
import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { Account, Company, CompanyService } from '../../../@core/services/company.service';
import { NbDialogService } from '@nebular/theme';
import { ToasterService } from '../../../@core/services/toaster.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { validateAndHandleNumericFields, validateRequiredFields } from '../../../utils/validation-utils';
import { FormatTextPipe } from '../../../utils/format-text.pipe';


@Component({
  selector: 'ngx-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent {

  

  settings = {
    actions: {
      position: 'right', // Moves action buttons to the right
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
      bankName: {
        title: 'Bank Name',
        type: 'string',
      },
      type: {
        title: 'Type',
        type: 'html',
        filter: false, // No filter needed
        valuePrepareFunction: (value) => new FormatTextPipe().transform(value), 
        editor: {
          type: 'list', // 'list' works if 'select' doesn't
          config: {
            selectText: 'Select...',
            list: [
              { value: 'CASH', title: 'Cash' },
              { value: 'WALLET', title: 'Wallet' },
              { value: 'BANK', title: 'Bank' }
            ],
          },
        },
      },
      description: {
        title: 'Description',
        type: 'string',
        filter: false,
      },
      balance: {
        title: 'Balance',
        type: 'number',
        filter: false,
      },
      accountNumber: {
        title: 'Account Number',
        type: 'string',
        filter: false,
      },
      iban: {
        title: 'Iban',
        type: 'string',
        filter: false,
      },
      isDefaultAccount: {
        title: 'Default Account',
        type: 'html',
        filter: false, // No filter needed
        valuePrepareFunction: (value) => new FormatTextPipe().transform(value), 
        editor: {
          type: 'list', // 'list' works if 'select' doesn't
          config: {
            selectText: 'Select...',
            list: [
              { value: 'YES', title: 'Yes' },
              { value: 'NO', title: 'No' },
            ],
          },
        },
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();
  getAccounts: Account[];

  constructor(private companyService: CompanyService, private dialogService: NbDialogService, private toasterService: ToasterService) { }


  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.companyService.getAccounts().subscribe(
      (data) => {
        this.getAccounts = data;
        this.source.load(data);
      },
      (error) => {
        console.error('Error fetching accounts:', error);
      }
    );
  }

  // Handle adding a new company
  onCreateConfirm(event): void {

    if (event?.newData?.isDefaultAccount === 'YES') {
      const existingDefaults = this.getAccounts.filter(
        acc => acc.isDefaultAccount === 'YES'
      );
    
      // Including the new data makes it more than one
      if (existingDefaults.length > 1) {
        this.toasterService.showError('Only one default account is allowed. Please deselect the existing default account first.');
        return;
      }
    }
    
    // ✅ Fields to validate
    const numericFields = ["accountNumber",];
    const requiredFields = ["name"];

    // ✅ Validate required fields
    if (!validateRequiredFields(event.newData, requiredFields, this.toasterService)) {
      return; // Stop execution if validation fails
    }

    if (!validateAndHandleNumericFields(event.newData, numericFields, this.toasterService, event)) {
      return; // Stop execution if validation fails
    }

    const newAccounts: Account = event.newData;
    this.companyService.addAccount(newAccounts).subscribe(
      (createdAccounts) => {
        event.confirm.resolve(createdAccounts);
        this.toasterService.showSuccess('Account created successfully!');

      },
      (error) => {
        console.error('Error adding account:', error);
        this.toasterService.showError('Failed to create account.');
        event.confirm.reject();
      }
    );
  }

  // Handle editing an existing account
  onEditConfirm(event): void {

    if (event?.newData?.isDefaultAccount === 'YES') {
      const existingDefaults = this.getAccounts.filter(
        acc => acc.isDefaultAccount === 'YES'
      );
    
      // Including the new data makes it more than one
      if (existingDefaults.length > 1) {
        this.toasterService.showError('Only one default account is allowed. Please deselect the existing default account first.');
        return;
      }
    }

    // ✅ Fields to validate
    const numericFields = ["accountNumber",];
    const requiredFields = ["name"];

    // ✅ Validate required fields
    if (!validateRequiredFields(event.newData, requiredFields, this.toasterService)) {
      return; // Stop execution if validation fails
    }

    if (!validateAndHandleNumericFields(event.newData, numericFields, this.toasterService, event)) {
      return; // Stop execution if validation fails
    }
    const updatedAccount: Account = event.newData;
    this.companyService.updateAccount(updatedAccount).subscribe(
      (response) => {
        event.confirm.resolve(response);
        this.toasterService.showSuccess('Account updated successfully!');
      },
      (error) => {
        console.error('Error updating account:', error);
        this.toasterService.showError('Failed to update account.');
        event.confirm.reject();
      }
    );
  }

  // Handle deleting a account
  onDeleteConfirm(event): void {
    this.dialogService.open(ConfirmDialogComponent, {
      context: {
        title: 'Delete Confirmation',
        message: 'Are you sure you want to delete this account?',
      },
    }).onClose.subscribe((confirmed) => {
      if (confirmed) {
        this.companyService.deleteAccount(event.data.id).subscribe(
          () => {
            event.confirm.resolve();
            this.toasterService.showSuccess('Account deleted successfully!');
          },
          (error) => {
            console.error('Error deleting account:', error);
            event.confirm.reject();
            this.toasterService.showError('Failed to delete account.');
          }
        );
      } else {
        event.confirm.reject();
      }
    });
  }

}

