import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../@core/services/client.service';
import { InvoiceService } from '../../../@core/services/invoice.service';
import { ToasterService } from '../../../@core/services/toaster.service';
import { NbDialogService } from '@nebular/theme';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { validateAndHandleNumericFields } from '../../../utils/validation-utils';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  selectedClient; // Stores selected client object
  selectedDateRange; // Stores selected date range
  showDetails = false; // Controls the accordion visibility
  selectedClientProjects: any[] = []; // Stores projects of selected client

  clients = [];

  // Smart Table Settings
  assetSettings = {
    actions: { add: false, edit: true, delete: true },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true
    },
    columns: {
      assetName: { title: 'Asset Name', type: 'string',filter:false },
      assetType: { title: 'Asset Type', type: 'string',filter:false },
      regularHours: { title: 'Regular Hours', type: 'number' ,filter:false},
      overtimeHours: { title: 'OT Hours', type: 'number' ,filter:false},
      regularRate: { title: 'Regular Price ($)', type: 'number' ,filter:false},
      overtimeRate: { title: 'OT Price ($)', type: 'number' ,filter:false},
      totalAmount: { 
        title: 'Total Cost ($)', 
        type: 'number',filter:false,
        editable: false, // 👈 Disable editing
        addable: false, // 👈 Hide in add form
        valuePrepareFunction: (cell, row) => (row.regularHours * row.regularRate) + (row.overtimeHours * row.overtimeRate)
      }
    }
  };
  invoiceData: any;
  summeryTotalAmount: any;
  routedInvoiceData: any;

  constructor(private router: Router,private clientService : ClientService,private invoiceService : InvoiceService,private toasterService: ToasterService,private dialogService: NbDialogService) {}

  ngOnInit(): void {
debugger;
    this.routedInvoiceData = this.invoiceService.getInvoice();
    // For View 
    if(this.routedInvoiceData?.view){
      this.invoiceData = this.routedInvoiceData;
        if (this.invoiceData?.detailedProjectInvoiceList) {
          this.showDetails = true;
            this.calculateTotalAmount();
        }
    }
    this.loadClients();
  }

  submitInvoice(){
    
    const updatedInvoice = {
      ...this.invoiceData, // Copy existing data
      totalAmount: this.summeryTotalAmount, // Update totalAmount
      invoiceDate: new Date().toISOString().split('T')[0] // Set to current date (YYYY-MM-DD)
    };

    this.invoiceService.addInvoice(updatedInvoice).subscribe({
      next: (response) => {
        this.toasterService.showSuccess('Invoice submitted successfully!');
        // ✅ Store invoice in service
      this.invoiceService.setInvoice(response);
        this.router.navigate(['/pages/features/print-invoice']);
      },
      error: (error) => {
        console.error("Error submitting timesheet:", error);
        this.toasterService.showError('Failed to submit invoice.');
      }
    });
  }

  loadClients(): void {
    this.clientService.getClients().subscribe(
      (data) => {
        this.clients = data;
        this.selectedClient = data[0]
      },
      (error) => {
        console.error('Error loading projects:', error);
      }
    );
  }

  // Handle Client Selection
  onClientSelect() {
    if (this.selectedClient) {
      this.selectedDateRange = ''; // Reset date selection when client changes
      this.showDetails = false; // Hide accordion when changing client
    } else {
      this.selectedClientProjects = [];
    }
  }

  // Toggle Invoice Details
  toggleDetails() {
    if (this.selectedClient && this.selectedDateRange) {
      this.prepareInvoice(this.selectedClient,this.selectedDateRange);
    }
  }

  prepareInvoice(selectedClient, selectedDate): void {
    const data = {
      client: {
        id: selectedClient?.id
      },
      startDate: selectedDate?.start,
      endDate: selectedDate?.end
    };

    this.invoiceService.prepareInvoic(data).subscribe(
      (data) => {
        this.invoiceData = data;
        if (this.invoiceData?.detailedProjectInvoiceList?.length != 0) {
          this.showDetails = true;
            this.calculateTotalAmount();
        }else{
          this.toasterService.showSuccess('No Record Found!');
        }
      },
      (error) => {
        console.error('Error loading projects:', error);
      }
    );
}

calculateTotalAmount() {
  if (!this.invoiceData?.detailedProjectInvoiceList) {
    this.summeryTotalAmount = 0; // Handle cases where no projects exist
    return;
  }

  this.summeryTotalAmount = this.invoiceData.detailedProjectInvoiceList.reduce((projectTotal, project) => {
    const projectAmount = (project.assetInvoicesList || []).reduce((sum, asset) => {
      return sum + (asset?.totalAmount ?? 0); // Use `??` to handle undefined/null values
    }, 0);

    return projectTotal + projectAmount;
  }, 0);
}



onAssetEdit(event: any, index: number, pId?: number) {
  const newData = event.newData;
  const assetId = newData.assetId;

 // ✅ Validate numeric fields
 const numericFields = ["regularRate", "regularHours", "overtimeRate", "overtimeHours"];
if (!validateAndHandleNumericFields(event.newData, numericFields, this.toasterService, event)) {
  return; // Stop execution if validation fails
}

  // ✅ Calculate Total Amount
  newData.totalAmount = (parseInt(newData.regularHours) * parseInt(newData.regularRate)) + 
                        (parseInt(newData.overtimeHours) * parseInt(newData.overtimeRate));

  let isUpdated = false;

  // ✅ Iterate through projects
  this.invoiceData.detailedProjectInvoiceList.forEach((project: any) => {
    if (project.projectId === pId) {
      project.assetInvoicesList.forEach((asset: any) => {
        if (asset.assetId === assetId) {
          // ✅ Update asset properties before resolving
          Object.assign(asset, newData);
          isUpdated = true;
        }
      });
    }
  });

  if (isUpdated) {
    // ✅ Recalculate total after updating invoiceData
    this.calculateTotalAmount();

    // ✅ Now resolve the event AFTER updating data
    event.confirm.resolve(event.newData);
  } else {
    event.confirm.reject();
    console.warn(`No matching asset found for assetId: ${assetId} inside projectId: ${pId}`);
  }
}


  

  // Handle Smart Table Delete Confirmation
  onAssetDelete(event: any, index: number, pId: number) {
    this.dialogService.open(ConfirmDialogComponent, {
      context: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this asset?',
      },
    }).onClose.subscribe((confirmed: boolean) => {
      if (!confirmed) {
        event.confirm.reject();
        return;
      }
  
      const assetId = event.data.assetId;
      let isDeleted = false;
  
      // ✅ Iterate through all projects
      this.invoiceData.detailedProjectInvoiceList = this.invoiceData.detailedProjectInvoiceList.filter((project: any) => {
        if (project.projectId === pId) {
          // ✅ Remove asset from assetInvoicesList
          project.assetInvoicesList = project.assetInvoicesList.filter(
            (asset: any) => asset.assetId !== assetId
          );
  
          // ✅ If assetInvoicesList is empty, remove the project
          if (project.assetInvoicesList.length === 0) {
            return false; // ❌ Remove this project
          }
  
          isDeleted = true;
        }
        return true; // ✅ Keep this project
      });
  
      if (isDeleted) {
        event.confirm.resolve();
        this.calculateTotalAmount();
      } else {
        event.confirm.reject();
        console.warn(`No matching asset found for assetId: ${assetId} inside projectId: ${pId}`);
      }
    });
  }
  
  
  
}
