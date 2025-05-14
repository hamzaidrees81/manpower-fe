import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../../@core/services/dashboard.service';
import { LocalDataSource } from 'ng2-smart-table';
import { FormatTextPipe } from '../../../../utils/format-text.pipe';

@Component({
  selector: 'ngx-asset-statistics-detail',
  templateUrl: './asset-statistics-detail.component.html',
  styleUrls: ['./asset-statistics-detail.component.scss']
})
export class AssetStatisticsDetailComponent implements OnInit {
  assetStatsList: any;

  // DataSources for tables
  sourceProjects: LocalDataSource = new LocalDataSource();
  sourceInvoices: LocalDataSource = new LocalDataSource();
  sourcePayments: LocalDataSource = new LocalDataSource();

  // Table settings
  projectSettings = {
    actions: false,
    columns: {
      projectId: { title: 'Project ID', type: 'number', filter: false },
      projectName: { title: 'Project Name', type: 'string', filter: false },
      startDate: { title: 'Start Date', type: 'string', filter: false },
      endDate: { title: 'End Date', type: 'string', filter: false },
      status: { title: 'Status', type: 'string', filter: false , valuePrepareFunction: (value) => new FormatTextPipe().transform(value),  },
    },
  };
  
  invoiceSettings = {
    actions: false,
    columns: {
      invoiceId: { title: 'Invoice ID', type: 'number', filter: false },
      invoiceNumber: { title: 'Invoice Number', type: 'number', filter: false },
      invoiceDate: { title: 'Invoice Date', type: 'string', filter: false },
      amount: { title: 'Amount', type: 'number', filter: false },
      status: { title: 'Status', type: 'string', filter: false, valuePrepareFunction: (value) => new FormatTextPipe().transform(value),  },
      // dueDate: { title: 'Due Date', type: 'string', filter: false },
    },
  };
  
  paymentSettings = {
    actions: false,
    columns: {
      paymentId: { title: 'Payment ID', type: 'number', filter: false },
      paymentDate: { title: 'Payment Date', type: 'string', filter: false },
      amount: { title: 'Amount', type: 'number', filter: false },
      // method: { title: 'Method', type: 'string', filter: false },
      status: { title: 'Reference', type: 'string', filter: false,valuePrepareFunction: (value) => new FormatTextPipe().transform(value),  },
    },
  };
  

  constructor(private dashboradService: DashboardService) {}

  ngOnInit(): void {
    const getId = localStorage.getItem('selectedAssetStats');
    if (getId) {
      const assetId = JSON.parse(getId);
      this.getAssetStatsList(assetId);
    }
  }

  getAssetStatsList(id: any): void {
    this.dashboradService.getAssetsStatsDetailByAssetId(id?.assetId).subscribe(
      (data) => {
        this.assetStatsList = data;
        console.log("this.assetStatsList", this.assetStatsList);

        // Load data into each table
        this.sourceProjects.load(this.assetStatsList?.projectAssignments || []);
        this.sourceInvoices.load(this.assetStatsList?.invoices || []);
        this.sourcePayments.load(this.assetStatsList?.payments || []);
      },
      (error) => {
        console.error('Error Loading Asset Stats Detail', error);
      }
    );
  }
}
