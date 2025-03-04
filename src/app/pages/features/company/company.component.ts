import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableData } from '../../../@core/data/smart-table';
import { Company, CompanyService } from '../../../@core/services/company.service';

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
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: SmartTableData,private companyService: CompanyService) {}
  

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
    const newCompany: Company = event.newData;
    this.companyService.addCompany(newCompany).subscribe(
      (createdCompany) => {
        event.confirm.resolve(createdCompany);
      },
      (error) => {
        console.error('Error adding company:', error);
        event.confirm.reject();
      }
    );
  }

  // Handle editing an existing company
  onEditConfirm(event): void {
    const updatedCompany: Company = event.newData;
    this.companyService.updateCompany(updatedCompany).subscribe(
      (response) => {
        event.confirm.resolve(response);
      },
      (error) => {
        console.error('Error updating company:', error);
        event.confirm.reject();
      }
    );
  }

  // Handle deleting a company
  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.companyService.deleteCompany(event.data.id).subscribe(
        () => {
          event.confirm.resolve();
        },
        (error) => {
          console.error('Error deleting company:', error);
          event.confirm.reject();
        }
      );
    } else {
      event.confirm.reject();
    }
  }
}
