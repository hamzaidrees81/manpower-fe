import { Component, OnInit } from "@angular/core";
import { NbDialogRef, NbDialogService } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { SponsorService } from "../../../@core/services/sponsor.service";
import { ConfirmDialogComponent } from "../../../shared/confirm-dialog/confirm-dialog.component";
import { ToasterService } from "../../../@core/services/toaster.service";
import { validateAndHandleNumericFields } from "../../../utils/validation-utils";

@Component({
  selector: 'ngx-sponsor-modal',
  templateUrl: './sponsor-modal.component.html',
  styleUrls: ['./sponsor-modal.component.scss']
})
export class SponsorModalComponent implements OnInit {
  sponsorSource = new LocalDataSource();
  rowData;
  sponsorSettings = {
    actions: {
      position: 'right',
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
      // sponsorId: {
      //   title: 'Sponsor ID',
      //   type: 'number',
      // },
      sponsorName: {
        title: 'Name',
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
      sponsorshipType: {
        title: 'Type',
        filter: false,
        type: 'string',
        editor: {
          type: 'list',
          config: {
            selectText: 'Select...',
            list: [
              { value: 'FIXED', title: 'Fixed' },
              { value: 'PERCENTAGE', title: 'Percentage' }
            ]
          }
        }
      },
      sponsorshipValue: {
        title: 'Value',
        filter: false,
        type: 'number',
      },
      sponsorshipDeterminant: {
        title: 'Determinant',
        filter: false,
        type: 'string',
        editor: {
          type: 'list',
          config: {
            selectText: 'Select...',
            list: [
              { value: 'REVENUE', title: 'Revenue' },
              { value: 'PROFIT', title: 'Profit' }
            ]
          }
        }
      },
      sponsorshipBasis: {
        title: 'Sponsorship Basis',
        filter: false,
        type: 'string',
        editor: {
          type: 'list',
          config: {
            selectText: 'Select...',
            list: [
              { value: 'ASSETBASED', title: 'Asset Based' },
              { value: 'PROJECTBASED', title: 'Project Based' }
            ]
          }
        }
      }
    }
  };
  sponsors: any[];

  constructor(protected dialogRef: NbDialogRef<SponsorModalComponent>, private sponsorService: SponsorService, private toasterService: ToasterService, private dialogService: NbDialogService) { }

  ngOnInit(): void {
    this.rowData = this.dialogRef.componentRef.instance;
    if (this.rowData) {
      if(this.rowData?.key === 'ASSET'){
        this.getSponsorsByAssetId(this.rowData?.id);
      }else {
        this.getSponsorsByProjectId(this.rowData?.id);
      }     
    }
    this.loadDropdowns();
  }

  getSponsorsByAssetId(id) {
    this.sponsorService.getAssetSponsorshipsById(id).subscribe(
      (data) => {
        const transformedData = data.map(item => ({
          ...item,
          sponsorName: {
            name : item.sponsorName,
            sponsorId : item.sponsorId
          }
        }));
  
        this.sponsorSource.load(transformedData);
      },
      (error) => {
        console.error('Error loading clients:', error);
      }
    );
  }
  
  

  getSponsorsByProjectId(id) {
    this.sponsorService.getProjectAssetSponsorshipsById(id).subscribe(
      (data) => {
        this.sponsorSource.load(data);
      },
      (error) => {
        console.error('Error loading clients:', error);
      }
    );
  }

  loadDropdowns(): void {
    // FETCH SPONSOR LIST
    this.sponsorService.getSponsors().subscribe((data) => {
      this.sponsors = data;
      this.sponsorSettings = {
        ...this.sponsorSettings,
        columns: {
          ...this.sponsorSettings.columns,
          sponsorName: {
            ...this.sponsorSettings.columns.sponsorName,
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

  // Add asset
  onCreateConfirm(event: any): void {
    const numericFields = ["sponsorshipValue"];
    // const requiredFields = ["idNumber", "name", "assetOwnership", "assetNumber", "assetType"];

    // ✅ Validate required fields
    // if (!validateRequiredFields(event.newData, requiredFields, this.toasterService)) {
    //   return; // Stop execution if validation fails
    // }

    if (!validateAndHandleNumericFields(event.newData, numericFields, this.toasterService, event)) {
      return; // Stop execution if validation fails
    }

    const parseLatestData = JSON.parse(event?.newData?.sponsorName);
    delete event?.newData?.sponsorName;


    const updateData = {
      ...event?.newData,
      assetId: this.rowData?.id,
      sponsorId:parseLatestData?.sponsorId,
      assetProjectId:1
    }

    // Call service to add the asset
    this.sponsorService.addProjectAssetSponsorships(updateData).subscribe({
      next: (data) => {
        event.confirm.resolve(data)
        this.toasterService.showSuccess('Asset Sponsor created successfully!');
      },
      error: (error) => {
        console.error('Error adding asset:', error);
        this.toasterService.showError('Failed to create asset sponsor.');
        event.confirm.reject();
      }
    });
  }



  onEditConfirm(event: any): void {

    const numericFields = ["sponsorshipValue"];
    // const requiredFields = ["idNumber", "name", "assetOwnership", "assetNumber", "assetType"];

    // ✅ Validate required fields
    // if (!validateRequiredFields(event.newData, requiredFields, this.toasterService)) {
    //   return; // Stop execution if validation fails
    // }

    if (!validateAndHandleNumericFields(event.newData, numericFields, this.toasterService, event)) {
      return; // Stop execution if validation fails
    }

    const parseLatestData = JSON.parse(event?.newData?.sponsorName);
    delete event?.newData?.sponsorName;


    const updateData = {
      ...event?.newData,
      assetId: this.rowData?.id,
      sponsorId:parseLatestData?.sponsorId,
      assetProjectId:1
    }

    this.sponsorService.updateProjectAssetSponsorships(event?.newData?.id, updateData).subscribe({
      next: (data) => {
        event.confirm.resolve(data)
        this.toasterService.showSuccess('Asset Sponsor updated successfully!');
      },
      error: (error) => {
        console.error('Error updating asset:', error);
        this.toasterService.showError('Failed to update asset sponsor.');
        event.confirm.reject();
      }
    });
  }

  onDeleteConfirm(event): void {
    this.dialogService.open(ConfirmDialogComponent, {
      context: {
        title: 'Delete Confirmation',
        message: 'Are you sure you want to delete this asset sponsor?',
      },
    }).onClose.subscribe((confirmed) => {
      if (confirmed) {
        this.sponsorService.deleteProjectAssetSponsorships(event.data.id).subscribe(
          () => {
            event.confirm.resolve();
            this.toasterService.showSuccess('Asset Sponsor deleted successfully!');
          },
          (error) => {
            console.error('Error deleting asset:', error);
            event.confirm.reject();
            this.toasterService.showError('Failed to delete asset sponsor.');
          }
        );
      } else {
        event.confirm.reject();
      }
    });
  }

  // Close Modal
  close() {
    this.dialogRef.close();
  }
}
