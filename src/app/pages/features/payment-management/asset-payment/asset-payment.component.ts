import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../../../@core/services/asset.service';
import { ToasterService } from '../../../../@core/services/toaster.service';
import { LocalDataSource } from 'ng2-smart-table';
import { FormatTextPipe } from '../../../../utils/format-text.pipe';
import { ExpenseService } from '../../../../@core/services/expense.service';
import { AccountsService } from '../../../../@core/services/accounts.service';

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
  selectedType;
  showDetails = false;
  selectAssetList: any[] = [];
  getSearchedData: any[];

  amount: number | null = null;
  remarks: string = '';
  mainAccountId;
  paymentDate: Date | null = null;
  paymentMethod: { label: string; value: string } | null = null;
  reference: string = '';
  paymentType: { label: string; value: string } | null = null;



  showPaymentTable = false;
  showHistoryTable = false;
  isAssetNameSelected = false;

  totalAmount = 0;
  pendingAmount = 0;
  paidAmount = 0;

  assetPaymentTableData: LocalDataSource = new LocalDataSource();
  paymentTableData: LocalDataSource = new LocalDataSource();
  historyTableData: LocalDataSource = new LocalDataSource();

  paymentTableSettings = {
    actions: false,
    hideSubHeader: true,
    columns: {
      expenseProjectName: { title: 'Project Name' },
      expenseCategoryName: { title: 'Category Name' },
      expenseType: { title: 'Type' },
      expenseMetric: { title: 'Metric' },
      amount: { title: 'Amount' },
      comment: { title: 'Comment' },
      status: { title: 'Status' },
    },
  };

  assetPaymentTableSettings = {
    actions: false,
    hideSubHeader: true,
    columns: {
      assetName: { title: 'Asset Name' },
      assetProjectName: { title: 'Project Name' },
      assetPayable: { title: 'Payable' },
      paidAmount: { title: 'Paid Amount'},
      paymentStatus: { title: 'Payment Status', valuePrepareFunction: (value) => new FormatTextPipe().transform(value), },
      // status: { title: 'Status' },
    },
  };

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
      assetName: {
        title: 'Asset Name',
        type: 'string',
        filter: false
      },
      amount: {
        title: 'Amount',
        type: 'number',
        filter: false
      },
      comment: {
        title: 'Comment',
        type: 'string',
        filter: false
      },
      expenseCategoryName: {
        title: 'Expense Category Name',
        type: 'string',
        filter: false
      },
      paymentDate: {
        title: 'Payment Date',
        type: 'string',
        filter: false,
        valuePrepareFunction: (date) => new Date(date).toLocaleDateString()
      },
      paymentMethod: {
        title: 'Payment Method',
        type: 'string',
        filter: false,
        valuePrepareFunction: (value) => new FormatTextPipe().transform(value),
      },
      expenseProjectName: {
        title: 'Project Name',
        type: 'string',
        filter: false
      },
      expenseType: {
        title: 'Payment Type',
        type: 'string',
        filter: false,
        valuePrepareFunction: (value) => new FormatTextPipe().transform(value),
      }
    }
  };
  
  filteredData;
  status: any;

  paymentMethods = [
    { key: 'BANK_TRANSFER', label: 'Bank Transfer' },
    { key: 'CASH', label: 'Cash' },
    { key: 'CHEQUE', label: 'Cheque' },
    { key: 'ONLINE_TRANSFER', label: 'Online Transfer' },
    { key: 'CREDIT_CARD', label: 'Credit Card' },
    { key: 'DEBIT_CARD', label: 'Debit Card' },
    { key: 'MOBILE_WALLET', label: 'Mobile Wallet' },
    { key: 'OTHER', label: 'Other' }
  ];
  
  paymentTypes = [
    { key: 'INITIAL', label: 'Initial' },
    { key: 'ADJUSTMENT', label: 'Adjustment' },
    { key: 'FULL', label: 'Full' },
    { key: 'REFUND', label: 'Refund' },
    { key: 'ADVANCE', label: 'Advance' }
  ];
  getAccounts: any[];
  
  
  constructor(private assetService: AssetService, private toasterService: ToasterService,private expenseService : ExpenseService,private accountsService : AccountsService) { }

  ngOnInit(): void {
    this.selectedType = 'ALL';
    this.loadAsset();
    this.onLoadList();
    this.loadExpense();
    this.loadAccount();
  }

  onLoadList() {
    this.assetService.getAssetPayblesByStatusAndAssetName(this.selectedType,this.selectedAssetByName?.id).subscribe(
      (data) => {
        this.filteredData = data;
        this.assetPaymentTableData.load(this.filteredData?.payables);
      },
      (error) => {
        console.error('Error loading assets:', error);
      }
    );
  }

  loadExpense() {
    this.expenseService.getExpenses().subscribe(
      (data) => {
        this.paymentTableData.load(data);
      },
      (error) => {
        console.error('Error loading assets:', error);
      }
    );
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

  loadAccount() {
    this.accountsService.getAccounts().subscribe(
      (data) => {
        this.getAccounts = data;
      },
      (error) => {
        console.error('Error loading assets:', error);
      }
    );
  }

  preparePayment(): void {

    //  const startDate = selectedDateRange?.start;
    //  const endDate = selectedDateRange?.end;

    this.isAssetNameSelected = true;
    this.getExpenseByAssetName();
    this.getPayableByAssetName();
  }

  getPayableByAssetName(){
    this.assetService.getAssetPayblesByStatusAndAssetName(this.selectedType,this.selectedAssetByName?.id).subscribe(
      (data) => {
        this.filteredData = data;
        this.assetPaymentTableData.load(this.filteredData?.payables);
        this.totalAmount = this.filteredData?.totalAmount;
        this.pendingAmount = this.filteredData?.pendingAmount;
        this.paidAmount = this.filteredData?.paidAmount;
      },
      (error) => {
        console.error('Error loading projects:', error);
      }
    );
  }

  getExpenseByAssetName(){
    this.expenseService.getExpenseByAssetName(this.selectedAssetByName?.id).subscribe(
      (data) => {
        this.assetPaymentTableData.load(data);
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
    this.amount = null;
    this.remarks = '';
    this.showPaymentTable = false;
    this.showHistoryTable = false;
  }

  onPay(): void {

    const paymentPayload = {
      paidToType:"ASSET",
      paidToId:this.selectedAssetByName?.id,
      amount: this.amount,
      mainAccountId:this.mainAccountId,
      remarks: this.remarks,
      paymentDate: this.paymentDate ? this.paymentDate.toISOString() : null,
      paymentMethod: this.paymentMethod,
      reference: this.reference,
      status:"COMPLETED",
      paymentType: this.paymentType
    };

    this.expenseService.addPayment(paymentPayload).subscribe(
      (data) => {
        this.toasterService.showSuccess('Payment paid successfully!');
        this.showHistoryTable = true;
        this.getHistory();
  
        // Optionally reset form fields
        this.resetForm();
      },
      (error) => {
        console.error('Error adding payment:', error);
        this.toasterService.showError('Failed to create payment.');
      }
    );
  }

  getHistory(){
   const paidToType = "ASSET";
    this.expenseService.getPaymentsByFilter(this.selectedAssetByName?.id,paidToType).subscribe(
      (data) => {
        this.historyTableData.load(data);
      },
      (error) => {
        console.error('Error loading projects:', error);
      }
    );
  }
  
  resetForm(): void {
    this.amount = null;
    this.remarks = '';
    this.paymentDate = null;
    this.paymentMethod = null;
    this.reference = '';
    this.paymentType = null;
  }

}
  

//   onPay() {
//     this.showHistoryTable = true;

//     // Push dummy data to history
//     const newEntry = {
//       id: this.historyTableData['data'].length + 1,
//       date: new Date().toISOString().split('T')[0],
//       amount: this.payAmount,
//       comments: this.payComment,
//     };

//     this.historyTableData.add(newEntry);
//     this.historyTableData.refresh();
//   }
// }
