import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../../../@core/services/asset.service';
import { ToasterService } from '../../../../@core/services/toaster.service';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'ngx-asset-payment',
  templateUrl: './asset-payment.component.html',
  styleUrls: ['./asset-payment.component.scss']
})
export class AssetPaymentComponent implements OnInit {
  assets: any[] = [];
  selectedAssetByName: any = null;
  selectedDateRange
  selectedAssetByNumber: any = null;
  showDetails = false;
  selectAssetList: any[] = [];
  getSearchedData: any[];


  showPaymentTable = false;
  showHistoryTable = false;

  totalAmount = 20000;
  pendingAmount = 8000;

  payAmount: number;
  payComment: string;

  paymentTableData = new LocalDataSource([
    { id: 1, date: '2024-04-01', invNo: 'INV-001', amount: 12000, status: 'Paid' },
    { id: 2, date: '2024-04-10', invNo: 'INV-002', amount: 8000, status: 'Pending' },
  ]);

  paymentTableSettings = {
    actions: false,
    hideSubHeader: true,
    columns: {
      id: { title: 'ID' },
      date: { title: 'Date' },
      invNo: { title: 'Inv No' },
      amount: { title: 'Amount' },
      status: { title: 'Status' },
    },
  };

  historyTableData = new LocalDataSource([
    { id: 1, date: '2024-04-15', amount: 4000, comments: 'First installment' },
    { id: 2, date: '2024-04-25', amount: 4000, comments: 'Second installment' },
  ]);

  historyTableSettings = {
    actions: {
      add: false,
      position: 'right',
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
      id: { filter:false,title: 'ID' },
      date: { filter:false,title: 'Date' },
      amount: { filter:false,title: 'Amount' },
      comments: { filter:false,title: 'Comments' },
    },
  };

  constructor(private assetService: AssetService,private toasterService : ToasterService) {}

  ngOnInit(): void {
    this.loadAsset();
  }

  loadAsset() {
    this.assetService.getAssetsByCompany().subscribe(
      (data) => {
        this.assets = data;
      },
      (error) => {
        console.error('Error loading assets:', error);
      }
    );
  }

  onAssetSelect(type: 'name' | 'number') {
    // Clear the other dropdown when one is selected
    if (type === 'name') {
      this.selectedAssetByNumber = null;
    } else {
      this.selectedAssetByName = null;
    }
    this.showPaymentTable  = false;
    this.selectAssetList = [];
  }

  toggleDetails() {
    this.showPaymentTable  = true;
    // if (this.selectedAssetByName || this.selectedAssetByNumber) {
    //   this.preparePayment(this.selectedAssetByName,this.selectedAssetByNumber);
    // }
  }

  preparePayment(selectedAssetByName, selectedAssetByNumber,selectedDateRange): void {
   const startDate = selectedDateRange?.start;
   const endDate = selectedDateRange?.end;
    this.assetService.getAssetByNameAndAssetNumber(selectedAssetByName,selectedAssetByNumber,startDate,endDate).subscribe(
      (data) => {
        this.getSearchedData = data;
          this.showPaymentTable  = true;
          this.toasterService.showSuccess('No Record Found!');
      
      },
      (error) => {
        console.error('Error loading projects:', error);
      }
    );
}
resetAssetSelection(): void {
  this.selectedAssetByName = null;
  this.selectedAssetByNumber = null;
  // this.paymentTableData = [];
  // this.historyTableData = [];
  this.totalAmount = 0;
  this.pendingAmount = 0;
  this.payAmount = null;
  this.payComment = '';
  this.showPaymentTable = false;
  this.showHistoryTable = false;
}


onPay() {
  this.showHistoryTable = true;

  // Push dummy data to history
  const newEntry = {
    id: this.historyTableData['data'].length + 1,
    date: new Date().toISOString().split('T')[0],
    amount: this.payAmount,
    comments: this.payComment,
  };

  this.historyTableData.add(newEntry);
  this.historyTableData.refresh();
}
}
