import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  selectedClient: any = null; // Stores selected client object
  selectedDateRange: string = ''; // Stores selected date range
  showDetails = false; // Controls the accordion visibility
  selectedClientProjects: any[] = []; // Stores projects of selected client

  // Mock Clients Data
  clients = [
    { 
      id: '1', name: 'John Doe', registrationDate: '2021-06-15', lastInvoice: '2024-02-20' 
    },
    { 
      id: '2', name: 'Jane Smith', registrationDate: '2020-04-10', lastInvoice: '2024-01-10' 
    },
    { 
      id: '3', name: 'Michael Johnson', registrationDate: '2019-08-25', lastInvoice: '2023-12-05' 
    }
  ];

  // Mock Date Ranges
  dateRanges = ['Last 7 Days', 'Last 30 Days', 'This Quarter', 'Last Quarter', 'This Year'];

  // Mock Projects Data (Each Client Has Multiple Projects)
  projects = {
    '1': [
      { 
        id: 'P001', name: 'Project Alpha', 
        assets: [
          { name: 'Asset A', regularHrs: 40, otHrs: 5, regularPrice: 50, otPrice: 75 },
          { name: 'Asset B', regularHrs: 35, otHrs: 10, regularPrice: 60, otPrice: 90 }
        ] 
      },
      { 
        id: 'P002', name: 'Project Beta', 
        assets: [
          { name: 'Asset C', regularHrs: 45, otHrs: 8, regularPrice: 55, otPrice: 82.5 }
        ] 
      }
    ],
    '2': [
      { 
        id: 'P003', name: 'Project Gamma', 
        assets: [
          { name: 'Asset D', regularHrs: 30, otHrs: 12, regularPrice: 48, otPrice: 72 }
        ] 
      },
      { 
        id: 'P004', name: 'Project Delta', 
        assets: [
          { name: 'Asset E', regularHrs: 38, otHrs: 7, regularPrice: 52, otPrice: 78 },
          { name: 'Asset F', regularHrs: 50, otHrs: 6, regularPrice: 45, otPrice: 67.5 }
        ] 
      }
    ]
  };

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
      name: { title: 'Asset Name', type: 'string' },
      regularHrs: { title: 'Regular Hours', type: 'number' },
      otHrs: { title: 'OT Hours', type: 'number' },
      regularPrice: { title: 'Regular Price ($)', type: 'number' },
      otPrice: { title: 'OT Price ($)', type: 'number' },
      totalHrs: { 
        title: 'Total Hours', 
        type: 'number',
        valuePrepareFunction: (cell, row) => row.regularHrs + row.otHrs
      },
      totalCost: { 
        title: 'Total Cost ($)', 
        type: 'number',
        valuePrepareFunction: (cell, row) => (row.regularHrs * row.regularPrice) + (row.otHrs * row.otPrice)
      }
    }
  };

  constructor() {}

  ngOnInit(): void {}

  // Handle Client Selection
  onClientSelect() {
    if (this.selectedClient) {
      this.selectedClientProjects = this.projects[this.selectedClient.id] || [];
      this.selectedDateRange = ''; // Reset date selection when client changes
      this.showDetails = false; // Hide accordion when changing client
    } else {
      this.selectedClientProjects = [];
    }
  }

  // Toggle Invoice Details
  toggleDetails() {
    if (this.selectedClient && this.selectedDateRange) {
      this.showDetails = true;
    }
  }

  // Handle Smart Table Edit Confirmation
  onAssetEdit(event: any) {
    if (window.confirm('Are you sure you want to edit?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  // Handle Smart Table Delete Confirmation
  onAssetDelete(event: any) {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
