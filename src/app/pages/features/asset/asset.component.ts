import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { Router } from '@angular/router';
import { CompanyService } from '../../../@core/services/company.service';
import { AssetService } from '../../../@core/services/asset.service';
import { CustomDatepickerComponent } from '../../../shared/custom-datepicker/custom-datepicker.component';
import { SmartTableDatepickerRenderComponentComponent } from '../../../shared/smart-table-datepicker-render-component/smart-table-datepicker-render-component.component';
import { DatePickerService } from '../../../@core/services/date-picker.service';
import { SponsorService } from '../../../@core/services/sponsor.service';

@Component({
  selector: 'ngx-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss'],
})
export class AssetComponent implements OnInit{

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
    columns : {
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
      sponsoredBy: {
        title: 'sponsored By',
        type: 'html',
        filter: false,
        valuePrepareFunction: (sponsor) => sponsor.name,
        editor: {
          type: 'list',
          config: {
            selectText: 'Select...',
            list: [],
          },
        },
      },
      name: {
        title: "Name",
        type: "string",
      },
      idNumber: {
        title: "ID Number",
        type: "string",
        filter: false,
      },
      iqamaExpiry: {
        title: 'Iqama Expiry',
        type: 'custom',
        renderComponent: SmartTableDatepickerRenderComponentComponent,
        filter: false,
        editor: {
          type: 'custom',
          component: CustomDatepickerComponent,
        }
      },
      phone: {
        title: "Phone",
        type: "string",
      },
      designation: {
        title: "Designation",
        type: "string",
      },
      passport: {
        title: "Passport",
        type: "number",
        filter: false,
      },
      passportExpiry: {
        title: 'Passport Expiry',
        type: 'custom',
        renderComponent: SmartTableDatepickerRenderComponentComponent,
        filter: false,
        editor: {
          type: 'custom',
          component: CustomDatepickerComponent,
        }
      },
      joiningDate: {
        title: 'Joining Date',
        type: 'custom',
        renderComponent: SmartTableDatepickerRenderComponentComponent,
        filter: false,
        editor: {
          type: 'custom',
          component: CustomDatepickerComponent,
        }
      },
      assetType: {
        title: "Asset Type",
        type: "string",
        filter: false,
      },
      assetNumber: {
        title: "Asset Number",
        type: "number",
        filter: false,
      }, 
    },
    selectMode: 'single', // Enables row selection
  }
  companies: any[] = []; 
  sponsors: any[] = [];

  source: LocalDataSource = new LocalDataSource();
  customSelectedJoiningDateDate: Date;
  customSelectedIqamaExpiryDate: Date;
  customSelectedPassportExpiryDate: Date;
  customSelectedJoiningDate: Date;

  constructor(private router: Router,private companyService: CompanyService,private assetService: AssetService,private datePickerService: DatePickerService,private sponsorService:SponsorService) {}

  ngOnInit(): void {
    this.loadDropdowns();
    this.loadAssets();
  }

    // Load all clients
    loadAssets(): void {
      this.assetService.getAssets().subscribe(
        (data) => {
          this.source.load(data);
        },
        (error) => {
          console.error('Error loading clients:', error);
        }
      );
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

    // FETCH SPONSOR LIST
    this.sponsorService.getSponsors().subscribe((data) => {
      this.sponsors = data;
      this.settings = {
        ...this.settings,
        columns: {
          ...this.settings.columns,
          sponsoredBy: {
            ...this.settings.columns.sponsoredBy,
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

  handleSelectedIqamaExpiryDate() {
    // START DATE
    this.datePickerService.selectedIqamaExpiryDate$.subscribe(event => {
      if (event) {
        this.customSelectedIqamaExpiryDate = event.date;
      }
    });
  }

  handleSelectedJoiningDate() {
    // START DATE
    this.datePickerService.selectedJoiningDateDate$.subscribe(event => {
      if (event) {
        this.customSelectedJoiningDate = event.date;
      }
    });
  }

  handleSelectedPassportExpiryDate() {
    // START DATE
    this.datePickerService.selectedPassportExpiryDate$.subscribe(event => {
      if (event) {
        this.customSelectedPassportExpiryDate = event.date;
      }
    });
  }

  // Add asset
  onCreateConfirm(event: any): void {
    this.handleSelectedIqamaExpiryDate();
    this.handleSelectedPassportExpiryDate();
    this.handleSelectedJoiningDate();
    // Parse selected company data
    const selectedCompany = JSON.parse(event.newData.company);
    const selectedSponsoredBy = JSON.parse(event.newData.sponsoredBy);
  
    // Prepare new asset object with dynamic company data
    const newAsset = {
      ...event.newData,
      company: selectedCompany, // Assign selected company
      passportExpiry: this.customSelectedPassportExpiryDate,
      joiningDate: this.customSelectedJoiningDate,
      iqamaExpiry: this.customSelectedIqamaExpiryDate,
      sponsoredBy: selectedSponsoredBy
    };
  
    // Call service to add the asset
    this.assetService.addAsset(newAsset).subscribe({
      next: (data) => event.confirm.resolve(data),
      error: (error) => {
        console.error('Error adding asset:', error);
        event.confirm.reject();
      }
    });
  }
  
  
    
  onEditConfirm(event: any): void {
    this.handleSelectedIqamaExpiryDate();
    this.handleSelectedPassportExpiryDate();
    this.handleSelectedJoiningDate();
    // Parse selected company data
    const selectedCompany = JSON.parse(event.newData.company);
    const selectedSponsoredBy = JSON.parse(event.newData.sponsoredBy);
  
    // Prepare new asset object with dynamic company data
    const updatedAsset = {
      ...event.newData,
      company: selectedCompany, // Assign selected company
      passportExpiry: this.customSelectedPassportExpiryDate,
      joiningDate: this.customSelectedJoiningDate,
      iqamaExpiry: this.customSelectedIqamaExpiryDate,
      sponsoredBy: selectedSponsoredBy
    };
    this.assetService.updateAsset(updatedAsset.id, updatedAsset).subscribe({
      next: (data) => event.confirm.resolve(data),
      error: (error) => {
        console.error('Error updating asset:', error);
        event.confirm.reject();
      }
    });
  }
  
    // Delete asset
    onDeleteConfirm(event: any): void {
      if (window.confirm('Are you sure you want to delete this asset?')) {
        this.assetService.deleteAsset(event.data.id).subscribe(
          () => {
            event.confirm.resolve();
          },
          (error) => {
            console.error('Error deleting asset:', error);
            event.confirm.reject();
          }
        );
      } else {
        event.confirm.reject();
      }
    }

// Handle row click
onRowSelect(event: any) {
  const rowData = event.data; // Get selected row data
  localStorage.setItem('selectedPerson', JSON.stringify(rowData)); // Save to local storage
  this.router.navigate(['/pages/features/timesheet']); // Navigate to timesheet
}
}
