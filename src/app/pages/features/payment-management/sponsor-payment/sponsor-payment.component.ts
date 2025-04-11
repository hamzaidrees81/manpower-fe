import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../../../@core/services/asset.service';
import { ToasterService } from '../../../../@core/services/toaster.service';
import { LocalDataSource } from 'ng2-smart-table';
import { FormatTextPipe } from '../../../../utils/format-text.pipe';

@Component({
  selector: 'ngx-sponsor-payment',
  templateUrl: './sponsor-payment.component.html',
  styleUrls: ['./sponsor-payment.component.scss']
})
export class SponsorPaymentComponent implements OnInit {
  sponsors: any[] = [];
  selectedAssetByName: any = null;
  selectedDateRange
  selectedAssetByNumber: any = null;
  selectedType;
  showDetails = false;
  selectAssetList: any[] = [];
  getSearchedData: any[];


  showPaymentTable = false;
  showHistoryTable = false;

  totalAmount = 0;
  pendingAmount = 0;
  paidAmount = 0;

  payAmount: number;
  payComment: string;

  sponsorPaymentTableData: LocalDataSource = new LocalDataSource();
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

  sponsorPaymentTableSettings = {
    actions: false,
    hideSubHeader: true,
    columns: {
      sponsorName: { title: 'Name' },
      sponsorshipAssetName: { title: 'Sponsor Asset Name' },
      sponsorshipPayable: { title: 'Payable' },
      sponsorshipDeterminant: { title: 'Determinant', valuePrepareFunction: (value) => new FormatTextPipe().transform(value), },
      paidAmount: { title: 'Paid Amount'},
      paymentStatus: { title: 'Payment Status', valuePrepareFunction: (value) => new FormatTextPipe().transform(value), },
      // status: { title: 'Status' },
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
      id: { filter: false, title: 'ID' },
      date: { filter: false, title: 'Date' },
      amount: { filter: false, title: 'Amount' },
      comments: { filter: false, title: 'Comments' },
    },
  };
  filteredData;
  status: any;

  constructor(private assetService: AssetService, private toasterService: ToasterService) { }

  ngOnInit(): void {
    this.selectedType = 'ALL';
    this.loadAsset();
    this.onLoadList();
  }

  onLoadList() {
    this.assetService.getSponosrPayableByStatusAndAssetName(this.selectedType,this.selectedAssetByName?.sponsoredById).subscribe(
      (data) => {
        this.filteredData = data;
        this.sponsorPaymentTableData.load(this.filteredData?.payables);
      },
      (error) => {
        console.error('Error loading assets:', error);
      }
    );
  }

  loadAsset() {
    this.assetService.getAssetsByCompany().subscribe(
      (data) => {
        this.sponsors = data;
      },
      (error) => {
        console.error('Error loading assets:', error);
      }
    );
  }

  preparePayment(): void {

    //  const startDate = selectedDateRange?.start;
    //  const endDate = selectedDateRange?.end;
    debugger;
    this.assetService.getSponosrPayableByStatusAndAssetName(this.selectedType,this.selectedAssetByName?.sponsoredById).subscribe(
      (data) => {
        this.filteredData = data;
        this.sponsorPaymentTableData.load(this.filteredData?.payables);
        this.totalAmount = this.filteredData?.totalAmount;
        this.pendingAmount = this.filteredData?.pendingAmount;
        this.paidAmount = this.filteredData?.paidAmount;
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
