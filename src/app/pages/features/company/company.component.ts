import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableData } from '../../../@core/data/smart-table';
import { Company, CompanyService } from '../../../@core/services/company.service';
import { NbDialogService } from '@nebular/theme';
import { ToasterService } from '../../../@core/services/toaster.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { validateAndHandleNumericFields } from '../../../utils/validation-utils';
@Component({
  selector: 'ngx-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
})
export class CompanyComponent {

  settings = {
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
        filter: false,
      },
      maxAssetCount: {
        title: 'Asset Count',
        type: 'number',
        filter: false,
      },
      headerImageUrl: {
        title: 'Header Image',
        type: 'string',
        filter: false,
      },
      footerImageUrl: {
        title: 'Footer Image',
        type: 'string',
        filter: false,
      },
      bankAccountTitle: {
        title: 'Account Title',
        type: 'string',
        filter: false,
      },
      bankAccountNumber: {
        title: 'Account Number',
        type: 'string',
        filter: false,
      },
      bankIban: {
        title: 'Bank Iban',
        type: 'string',
        filter: false,
      },
      bankName: {
        title: 'Bank Name',
        type: 'string',
        filter: false,
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: SmartTableData,private companyService: CompanyService,private dialogService: NbDialogService,private toasterService: ToasterService) {}
  

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companyService.getCompanies().subscribe(
      (data) => {
        this.source.load(data);
      },
      (error) => {
        console.error('Error fetching companies:', error);
      }
    );
  }

  // Handle adding a new company
  onCreateConfirm(event): void {

// ✅ Fields to validate
const numericFields = ["maxAssetCount"];

if (!validateAndHandleNumericFields(event.newData, numericFields, this.toasterService, event)) {
  return; // Stop execution if validation fails
}
  
    const newCompany: Company = event.newData;
    this.companyService.addCompany(newCompany).subscribe(
      (createdCompany) => {
        event.confirm.resolve(createdCompany);
        this.toasterService.showSuccess('Company created successfully!');

      },
      (error) => {
        console.error('Error adding company:', error);
        this.toasterService.showError('Failed to create company.');
        event.confirm.reject();
      }
    );
  }

  // Handle editing an existing company
  onEditConfirm(event): void {
    // ✅ Fields to validate
const numericFields = ["maxAssetCount"];

if (!validateAndHandleNumericFields(event.newData, numericFields, this.toasterService, event)) {
  return; // Stop execution if validation fails
}
    const updatedCompany: Company = event.newData;
    this.companyService.updateCompany(updatedCompany).subscribe(
      (response) => {
        event.confirm.resolve(response);
        this.toasterService.showSuccess('Company updated successfully!');
      },
      (error) => {
        console.error('Error updating company:', error);
        this.toasterService.showError('Failed to update company.');
        event.confirm.reject();
      }
    );
  }

  // Handle deleting a company
  onDeleteConfirm(event): void {
    this.dialogService.open(ConfirmDialogComponent, {
      context: {
        title: 'Delete Confirmation',
        message: 'Are you sure you want to delete this company?',
      },
    }).onClose.subscribe((confirmed) => {
      if (confirmed) {
        this.companyService.deleteCompany(event.data.id).subscribe(
          () => {
            event.confirm.resolve();
            this.toasterService.showSuccess('Company deleted successfully!');
          },
          (error) => {
            console.error('Error deleting company:', error);
            event.confirm.reject();
            this.toasterService.showError('Failed to delete company.');
          }
        );
      } else {
        event.confirm.reject();
      }
    });
  }
  
}
