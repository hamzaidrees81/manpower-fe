import { Component, OnInit } from "@angular/core";
import { NbDialogRef, NbDialogService } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { SponsorService } from "../../../@core/services/sponsor.service";
import { ConfirmDialogComponent } from "../../../shared/confirm-dialog/confirm-dialog.component";
import { ToasterService } from "../../../@core/services/toaster.service";
import { validateAndHandleNumericFields } from "../../../utils/validation-utils";
import { FormatTextPipe } from "../../../utils/format-text.pipe";

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
      project: {
        title: 'Project Name',
        type: 'html',
        filter: false,
        editable: false,
        addable: false,
        valuePrepareFunction: (project) => project?.name,
        editor: {
          type: 'list',
          config: {
            selectText: 'Select...',
            list: [],
          },
        },
      },
      sponsorId: {
        title: 'Name',
        type: 'html',
        filter:false,
        editor: {
          type: 'list',
          config: {
            list: [],
          },
        },
        valuePrepareFunction: (value) => {
          const found = this.sponsors.find(b => b.id === value);
          return found ? found?.name : value;
        }
        
      },
      sponsorshipType: {
        title: 'Type',
        filter: false,
        type: 'string',
        valuePrepareFunction: (value) => new FormatTextPipe().transform(value),
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
        valuePrepareFunction: (value) => new FormatTextPipe().transform(value),
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
        valuePrepareFunction: (value) => new FormatTextPipe().transform(value),
        editor: {
          type: 'list',
          config: {
            selectText: 'Select...',
            list: []
          }
        }
      }
    }
  };
  sponsors: any[];
  createData: any;

  constructor(protected dialogRef: NbDialogRef<SponsorModalComponent>, private sponsorService: SponsorService, private toasterService: ToasterService, private dialogService: NbDialogService) { }

  ngOnInit(): void {
    this.rowData = this.dialogRef.componentRef.instance;
    if (this.rowData) {
      if(this.rowData?.key === 'ASSET'){
        this.getsponsorshipBasis( { value: 'ASSET_BASED', title: 'Asset Based' },);
        this.getSponsorsByAssetId(this.rowData?.id);
      }else {
        this.getsponsorshipBasis( { value: 'PROJECT_BASED', title: 'Project Based' },);
        
        this.getSponsorsByAssetId(this.rowData?.assetId);
      }     
    }
    this.loadDropdowns();
  }

  getsponsorshipBasis(data): void {
      this.sponsorSettings = {
        ...this.sponsorSettings,
        columns: {
          ...this.sponsorSettings.columns,
          sponsorshipBasis: {
            ...this.sponsorSettings.columns.sponsorshipBasis,
            editor: {
              type: 'list',
              config: {
                selectText: 'Select...',
                list:[data]
              },
            },
          },
        },
      };
  }

  getSponsorsByAssetId(id) {
    this.sponsorService.getAssetSponsorshipsById(id).subscribe(
      (data) => {
        let filteredData = data;
  
        if (this.rowData?.key === 'ASSET') {
          // Prefer ASSET_BASED
          const assetBased = data.filter(item => item.sponsorshipBasis === 'ASSET_BASED');
  
          if (assetBased.length > 0) {
            filteredData = assetBased;
          }
        } else {
          // Fallback to PROJECT_BASED
          const projectBased = data.filter(item => item.sponsorshipBasis === 'PROJECT_BASED');
          if (projectBased.length > 0) {
            filteredData = projectBased;
          }
        }
  
        this.sponsorSource.load(filteredData);
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
          sponsorId: {
            ...this.sponsorSettings.columns.sponsorId,
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

  // Add asset
  onCreateConfirm(event: any): void {
    // const numericFields = ["sponsorshipValue"];
    // const requiredFields = ["idNumber", "name", "assetOwnership", "assetNumber", "assetType"];

    // ✅ Validate required fields
    // if (!validateRequiredFields(event.newData, requiredFields, this.toasterService)) {
    //   return; // Stop execution if validation fails
    // }

    // if (!validateAndHandleNumericFields(event.newData, numericFields, this.toasterService, event)) {
    //   return; // Stop execution if validation fails
    // }

    // const parseLatestData = JSON.parse(event?.newData?.sponsor);
    // delete event?.newData?.sponsorName;


    if(this.rowData?.key === 'ASSET'){
      this.createData = {
        ...event?.newData,
        assetId: this.rowData?.id,
        sponsorId:event?.newData?.sponsorId,
      }
    }else{
      this.createData = {
        ...event?.newData,
        assetId:this.rowData?.assetId,
        sponsorId:event?.newData?.sponsorId,
        assetProjectId: this.rowData?.id
      }
    }


    delete this.createData?.sponsor;
    delete this.createData?.project;

    // Call service to add the asset
    this.sponsorService.addProjectAssetSponsorships(this.createData).subscribe({
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

    // const numericFields = ["sponsorshipValue"];
    // const requiredFields = ["idNumber", "name", "assetOwnership", "assetNumber", "assetType"];

    // ✅ Validate required fields
    // if (!validateRequiredFields(event.newData, requiredFields, this.toasterService)) {
    //   return; // Stop execution if validation fails
    // }

    // if (!validateAndHandleNumericFields(event.newData, numericFields, this.toasterService, event)) {
    //   return; // Stop execution if validation fails
    // }

    // const parseLatestData = JSON.parse(event?.newData?.sponsor);
    // delete event?.newData?.sponsorName;



    if(this.rowData?.key === 'ASSET'){
      this.createData = {
        ...event?.newData,
        assetId: event?.newData?.assetId,
        sponsorId:event?.newData?.sponsorId,
      }
    }else{
      this.createData = {
        ...event?.newData,
        assetId: event?.newData?.assetId,
        sponsorId:event?.newData?.sponsorId,
        assetProjectId: this.rowData?.id
      }
    }

    delete this.createData?.sponsor;
    delete this.createData?.project;

    this.sponsorService.updateProjectAssetSponsorships(event?.newData?.id, this.createData).subscribe({
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
