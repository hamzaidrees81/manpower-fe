import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { Router } from '@angular/router';
import { CompanyService } from '../../../@core/services/company.service';
import { AssetService } from '../../../@core/services/asset.service';
import { CustomDatepickerComponent } from '../../../shared/custom-datepicker/custom-datepicker.component';
import { SmartTableDatepickerRenderComponentComponent } from '../../../shared/smart-table-datepicker-render-component/smart-table-datepicker-render-component.component';
import { DatePickerService } from '../../../@core/services/date-picker.service';
import { SponsorService } from '../../../@core/services/sponsor.service';
import { validateAndHandleNumericFields, validateRequiredFields } from '../../../utils/validation-utils';
import { ToasterService } from '../../../@core/services/toaster.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { NbDialogService } from '@nebular/theme';
import { ButtonViewComponent } from '../../../shared/button-view/button-view.component';
import { SponsorModalComponent } from '../sponsor-modal/sponsor-modal.component';
import { AddButtonComponent } from '../../../shared/add-button/add-button.component';
import { FormatTextPipe } from '../../../utils/format-text.pipe';
import { DesignationService } from '../../../@core/services/designation.service';

@Component({
  selector: 'ngx-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss'],
})
export class AssetComponent implements OnInit {

  settings = {
    actions: {
      position: 'right', // Moves action buttons to the right
    },
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
      // company: {
      //   title: 'Company',
      //   type: 'html',
      //   filter: false,
      //   valuePrepareFunction: (company) => company.name,
      //   editor: {
      //     type: 'list',
      //     config: {
      //       selectText: 'Select...',
      //       list: [],
      //     },
      //   },
      // },
      
      button: {
        title: 'Timesheet',
        type: 'custom',
        filter: false,
        editable: false,
        addable: false,
        renderComponent: ButtonViewComponent,
        onComponentInitFunction(instance) {
          const sub = instance.save.subscribe(row => {
          });

          // ✅ Prevent memory leaks by unsubscribing
          instance.ngOnDestroy = () => sub.unsubscribe();
        }
      },
      idNumber: {
        title: "ID",
        type: "string",
        filter: false,
        editable: false,
        addable: false,
      },
      name: {
        title: "Name",
        type: "string",
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
        filter: false,
      },
      designationId: {
        title: 'Designation',
        type: 'html',
        filter:false,
        editor: {
          type: 'list',
          config: {
            list: [],
          },
        },
        valuePrepareFunction: (value) => {
          const found = this.designation.find(b => b.id === value);
          return found ? found?.name : value;
        }
        
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
        title: 'Type',
        type: 'html',
        filter: false, // No filter needed
        valuePrepareFunction: (value) => new FormatTextPipe().transform(value),
        editor: {
          type: 'list', // 'list' works if 'select' doesn't
          config: {
            selectText: 'Select...',
            list: [
              { value: 'MANPOWER', title: 'Manpower' },
              { value: 'ITEM', title: 'Item' }
            ],
          },
        },
      },

      assetNumber: {
        title: "Number",
        type: "number",
        filter: false,
      },
      assetOwnership: {
        title: 'Ownership',
        type: 'html',
        filter: false,
        valuePrepareFunction: (value) => new FormatTextPipe().transform(value),
        editor: {
          type: 'list',
          config: {
            selectText: 'Select...',
            list: [
              { value: 'SELF', title: 'Self' },
              { value: 'RENTAL', title: 'Rental' }
            ],
          },
        },
      },
      // sponsoredBy: {
      //   title: 'Sponsored By',
      //   type: 'html',
      //   filter: false,
      //   valuePrepareFunction: (sponsor) => sponsor.name,
      //   editor: {
      //     type: 'list',
      //     config: {
      //       selectText: 'Select...',
      //       list: [],
      //     },
      //   },
      // },
      // sponsorshipType: {
      //   title: "Sponsorship Type",
      //   type: "string", // Change type to "string" since it's a dropdown
      //   filter: false,
      //   editor: {
      //     type: "list",
      //     config: {
      //       selectText: "Select Type", // Placeholder text
      //       list: [
      //         { value: "FIXED", title: "Fixed" },
      //         { value: "PERCENTAGE", title: "Percentage" },
      //       ],
      //     },
      //   },
      // },
      // sponsorshipValue: {
      //   title: "Sponsorship Value",
      //   type: "number",
      //   filter: false,
      // },
      addSponsorButton: {
        title: 'Add Sponsor',
        type: 'custom',
        filter: false,
        add:false,
        editable: false,
        addable: false,
        renderComponent: AddButtonComponent,
        onComponentInitFunction: (instance) => {
          const sub = instance.save.subscribe(row => {
            this.openSponsorModal(row); // ✅ this refers to your component class
          });
        
          instance.ngOnDestroy = () => sub.unsubscribe();
        }
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
  designation: any;

  constructor(private designationService : DesignationService ,private dialogService: NbDialogService, private toasterService: ToasterService, private router: Router, private companyService: CompanyService, private assetService: AssetService, private datePickerService: DatePickerService, private sponsorService: SponsorService) { }

  ngOnInit(): void {
    this.loadDropdowns();
    this.loadAssets();
  }

  openSponsorModal(row: any) {
    const  updateRow = {
      ...row,
      key : 'ASSET'
    }
    this.dialogService.open(SponsorModalComponent, {
      context: updateRow,
      closeOnBackdropClick: false,
    });
  }

  // Load all clients
  loadAssets(): void {
    this.assetService.getAssetsByCompany().subscribe(
      (data) => {
        const newData = data.map(item => ({
          ...item,
          sponsoredBy: {
            id: item?.sponsoredById,
            name: item?.sponsoredName
          },
          designationId:item?.designation?.id,
          designationName:item?.designation?.nam,
        }));
        this.source.load(newData);
      },
      (error) => {
        console.error('Error loading clients:', error);
      }
    );
  }

  loadDropdowns(): void {
    // FETCH SPONSOR LIST
    // this.sponsorService.getSponsors().subscribe((data) => {
    //   this.sponsors = data;
    //   this.settings = {
    //     ...this.settings,
    //     columns: {
    //       ...this.settings.columns,
    //       sponsoredBy: {
    //         ...this.settings.columns.sponsoredBy,
    //         editor: {
    //           type: 'list',
    //           config: {
    //             selectText: 'Select...',
    //             list: data.map((c) => ({
    //               value: JSON.stringify(c), // Store whole object as string
    //               title: c.name, // Display name
    //             })),
    //           },
    //         },
    //       },
    //     },
    //   };
    // });
    this.designationService.getDesignations().subscribe((data) => {
      this.designation = data;
      this.settings = {
        ...this.settings,
        columns: {
          ...this.settings.columns,
          designationId: {
            ...this.settings.columns.designationId,
            editor: {
              type: 'list',
              config: {
                list: data.map((c) => ({
                  value: c.id, // Store whole object as string
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

    // const numericFields = ["idNumber", "phone", "assetNumber"];
    // const requiredFields = ["idNumber", "name", "assetOwnership", "assetNumber", "assetType"];

    // ✅ Validate required fields
    // if (!validateRequiredFields(event.newData, requiredFields, this.toasterService)) {
    //   return; // Stop execution if validation fails
    // }

    // if (!validateAndHandleNumericFields(event.newData, numericFields, this.toasterService, event)) {
    //   return; // Stop execution if validation fails
    // }
    // Parse selected company data
    const latestData = event.newData;
    // const parseLatestData = JSON.parse(latestData?.designation);

    // Prepare new asset object with dynamic company data
    const newAsset = {
      ...event.newData,
      company: latestData?.company, // Assign selected company
      designation: {id:event?.newData?.designationId},
      passportExpiry: this.customSelectedPassportExpiryDate,
      joiningDate: this.customSelectedJoiningDate,
      iqamaExpiry: this.customSelectedIqamaExpiryDate,
      // sponsoredBy: parseLatestData?.sponsorId
    };

    delete newAsset?.addSponsorButton;
    delete newAsset?.button;

    // Call service to add the asset
    this.assetService.addAsset(newAsset).subscribe({
      next: (data) => {
        event.confirm.resolve(data)
        this.reloadCurrentRoute();
        this.toasterService.showSuccess('Asset created successfully!');
      },
      error: (error) => {
        console.error('Error adding asset:', error);
        this.toasterService.showError('Failed to create asset.');
        event.confirm.reject();
      }
    });
  }

  reloadCurrentRoute(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  onEditConfirm(event: any): void {
    this.handleSelectedIqamaExpiryDate();
    this.handleSelectedPassportExpiryDate();
    this.handleSelectedJoiningDate();

    // const numericFields = ["idNumber", "phone", "assetNumber"];
    // const requiredFields = ["idNumber", "name", "assetOwnership", "assetNumber", "assetType"];

    // // ✅ Validate required fields
    // if (!validateRequiredFields(event.newData, requiredFields, this.toasterService)) {
    //   return; // Stop execution if validation fails
    // }

    // if (!validateAndHandleNumericFields(event.newData, numericFields, this.toasterService, event)) {
    //   return; // Stop execution if validation fails
    // }
    // Parse selected company data
    const latestData = event.newData;
    const parseLatestData = latestData

    // Prepare new asset object with dynamic company data
    const updatedAsset = {
      ...event.newData,
      company: parseLatestData?.company, // Assign selected company
      designation: {id:event?.newData?.designationId},
      passportExpiry: this.customSelectedPassportExpiryDate ? this.customSelectedPassportExpiryDate :event?.newData?.passportExpiry ,
      joiningDate: this.customSelectedJoiningDate ? this.customSelectedJoiningDate : event?.newData?.joiningDate,
      iqamaExpiry: this.customSelectedIqamaExpiryDate ? this.customSelectedIqamaExpiryDate : event?.newData?.iqamaExpiry,
      // sponsoredBy: parseLatestData?.sponsorId
    };
    this.assetService.updateAsset(updatedAsset.id, updatedAsset).subscribe({
      next: (data) => {
        event.confirm.resolve(data);
        this.reloadCurrentRoute();
        this.toasterService.showSuccess('Asset updated successfully!');
      },
      error: (error) => {
        console.error('Error updating asset:', error);
        this.toasterService.showError('Failed to update asset.');
        event.confirm.reject();
      }
    });
  }

  onDeleteConfirm(event): void {
    this.dialogService.open(ConfirmDialogComponent, {
      context: {
        title: 'Delete Confirmation',
        message: 'Are you sure you want to delete this asset?',
      },
    }).onClose.subscribe((confirmed) => {
      if (confirmed) {
        this.assetService.deleteAsset(event.data.id).subscribe(
          () => {
            event.confirm.resolve();
            this.toasterService.showSuccess('Asset deleted successfully!');
          },
          (error) => {
            console.error('Error deleting asset:', error);
            event.confirm.reject();
            this.toasterService.showError('Failed to delete asset.');
          }
        );
      } else {
        event.confirm.reject();
      }
    });
  }
}
