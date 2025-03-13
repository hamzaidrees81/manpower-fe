import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { CompanyService } from '../../../@core/services/company.service';
import { SponsorService } from '../../../@core/services/sponsor.service';
import { NbDialogService } from '@nebular/theme';
import { ToasterService } from '../../../@core/services/toaster.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { validateAndHandleNumericFields } from '../../../utils/validation-utils';

@Component({
  selector: 'ngx-sponsor',
  templateUrl: './sponsor.component.html',
  styleUrls: ['./sponsor.component.scss']
})
export class SponsorComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource(); // Table data source

  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true, // Enable confirmation on add
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true, // Enable confirmation on edit
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      company: {
        title: 'Company',
        type: 'html',
        filter: false,
        valuePrepareFunction: (company) => company.name,
        editor: {
          type: 'list',
          config: {
            selectText: 'Select...',
            list: [],
          },
        },
      },
      sponsorId: {
        title: 'Sponsor ID',
        type: 'number',
        filter: false,
      },
      name: {
        title: 'Name',
        type: 'string',
      },
      phone: {
        title: 'Phone',
        type: 'string',
        filter: false,
      },
    },
  };
  companies: any[] = []; // Store company list

  constructor(private companyService: CompanyService,private sponsorService: SponsorService,private dialogService: NbDialogService,private toasterService: ToasterService) {}

  ngOnInit(): void {
    this.loadSponsors();
    this.loadDropdowns();
  }

  loadDropdowns(): void {
    this.companyService.getCompanies().subscribe((data) => {
      this.companies = data;
      this.settings = {
        ...this.settings,
        columns: {
          ...this.settings.columns,
          company: {
            ...this.settings.columns.company,
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

  // Load all Sponsors
  loadSponsors(): void {
    this.sponsorService.getSponsors().subscribe(
      (data) => {
        this.source.load(data);
      },
      (error) => {
        console.error('Error loading Sponsors:', error);
      }
    );
  }

  // Add Sponsors
  onCreateConfirm(event: any): void {
    const numericFields = ["sponsorId","phone"];
    
    if (!validateAndHandleNumericFields(event.newData, numericFields, this.toasterService, event)) {
      return; // Stop execution if validation fails
    }
    const newSponsors = event.newData;
    const updateSponsor = {
      ...newSponsors,
      company: JSON.parse(event.newData.company),
    };
    this.sponsorService.addSponsors(updateSponsor).subscribe(
      (data) => {
        event.confirm.resolve(data);
        this.toasterService.showSuccess('Sponsor created successfully!');
      },
      (error) => {
        console.error('Error adding Sponsors:', error);
        this.toasterService.showError('Failed to create sponsor.');
        event.confirm.reject();
      }
    );
  }

  // Update Sponsors
  onEditConfirm(event: any): void {
    const numericFields = ["sponsorId","phone"];
    
    if (!validateAndHandleNumericFields(event.newData, numericFields, this.toasterService, event)) {
      return; // Stop execution if validation fails
    }
    const updatedSponsors = event.newData;
    const updateSponsor = {
      ...updatedSponsors,
      company: JSON.parse(event.newData.company),
    };
    this.sponsorService.updateSponsors(updateSponsor.id, updateSponsor).subscribe(
      (data) => {
        event.confirm.resolve(data);
        this.toasterService.showSuccess('Sponsor updated successfully!');
      },
      (error) => {
        console.error('Error updating Sponsors:', error);
        this.toasterService.showError('Failed to update sponsor.');
        event.confirm.reject();
      }
    );
  }

  // Delete Sponsors
  onDeleteConfirm(event: any): void {
    this.dialogService.open(ConfirmDialogComponent, {
      context: {
        title: 'Delete Sponsor',
        message: 'Are you sure you want to delete this sponsor?',
      },
    }).onClose.subscribe((confirmed) => {
      if (confirmed) {
        this.sponsorService.deleteSponsors(event.data.id).subscribe(
          () => {
            event.confirm.resolve();
            this.toasterService.showSuccess('Sponsor deleted successfully!');
          },
          (error) => {
            console.error('Error deleting sponsor:', error);
            event.confirm.reject();
            this.toasterService.showError('Failed to delete sponsor.');
          }
        );
      } else {
        event.confirm.reject();
      }
    });
  }
}
