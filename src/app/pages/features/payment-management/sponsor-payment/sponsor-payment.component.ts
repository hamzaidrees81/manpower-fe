import { Component, OnInit } from '@angular/core';
import { SponsorService } from '../../../../@core/services/sponsor.service';
import { ToasterService } from '../../../../@core/services/toaster.service';
import { LocalDataSource } from 'ng2-smart-table';
import { FormatTextPipe } from '../../../../utils/format-text.pipe';
import { ExpenseService } from '../../../../@core/services/expense.service';
import { AccountsService } from '../../../../@core/services/accounts.service';
import { CustomDatepickerComponent } from '../../../../shared/custom-datepicker/custom-datepicker.component';
import { SmartTableDatepickerRenderComponentComponent } from '../../../../shared/smart-table-datepicker-render-component/smart-table-datepicker-render-component.component';

@Component({
  selector: 'ngx-sponsor-payment',
  templateUrl: './sponsor-payment.component.html',
  styleUrls: ['./sponsor-payment.component.scss']
})
export class SponsorPaymentComponent implements OnInit {
  sponsors: any[] = [];
  selectedSponsorByName: any = null;
  selectedDateRange
  selectedSponsorByNumber: any = null;
  selectedType;
  showDetails = false;
  selectSponsorList: any[] = [];
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
  isSponsorNameSelected = false;

  totalAmount = 0;
  pendingAmount = 0;
  paidAmount = 0;

  sponsorPaymentTableData: LocalDataSource = new LocalDataSource();
  paymentTableData: LocalDataSource = new LocalDataSource();
  historyTableData: LocalDataSource = new LocalDataSource();

  paymentTableSettings = {
    actions: false,
    hideSubHeader: true,
    columns: {
      sponsorName: { title: 'Name' },
      sponsorshipAssetName: { title: 'Asset Name' },
      sponsorshipPayable: { title: 'Payable' },
      sponsorshipDeterminant: { title: 'Determinant' },
      paidAmount: { title: 'Amount' },
      paymentStatus: { title: 'Payment Status', valuePrepareFunction: (value) => new FormatTextPipe().transform(value), },
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
      paidToName: {
        title: 'Name',
        type: 'string',
        filter: false
      },
      mainAccountName: {
        title: 'Account Name',
        type: 'string',
        filter: false
      },
      paymentDate: {
          title: 'Payment Date',
          type: 'custom',
          renderComponent: SmartTableDatepickerRenderComponentComponent,
          filter: false,
          editor: {
            type: 'custom',
            component: CustomDatepickerComponent,
          }
        },
      reference: {
        title: 'Reference',
        type: 'string',
        filter: false
      },
      remarks: {
        title: 'Remarks',
        type: 'string',
        filter: false
      },
      paymentMethod: {
        title: 'Method',
        type: 'string',
        filter: false,
        valuePrepareFunction: (value) => new FormatTextPipe().transform(value),
      },
      paymentType: {
        title: 'Type',
        type: 'string',
        filter: false,
        valuePrepareFunction: (value) => new FormatTextPipe().transform(value),
      },
      amount: {
        title: 'Amount',
        type: 'number',
        filter: false
      },
      
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
  
  
  constructor(private sponsorService: SponsorService, private toasterService: ToasterService,private expenseService : ExpenseService,private accountsService : AccountsService) { }

  ngOnInit(): void {
    this.selectedType = 'ALL';
    this.loadSponsor();
    this.onLoadList();
    this.loadAccount();
  }

  onLoadList() {
    this.sponsorService.getSponsorPayblesByStatusAndAssetName(this.selectedType,this.selectedSponsorByName?.id).subscribe(
      (data) => {
        this.filteredData = data;
        this.sponsorPaymentTableData.load(this.filteredData?.payables);
      },
      (error) => {
        console.error('Error loading sponsors:', error);
      }
    );
  }

  loadSponsor() {
    this.sponsorService.getSponsors().subscribe(
      (data) => {
        this.sponsors = data;
      },
      (error) => {
        console.error('Error loading sponsors:', error);
      }
    );
  }

  loadAccount() {
    this.accountsService.getAccounts().subscribe(
      (data) => {
        this.getAccounts = data;
      },
      (error) => {
        console.error('Error loading sponsors:', error);
      }
    );
  }

  preparePayment(): void {

    //  const startDate = selectedDateRange?.start;
    //  const endDate = selectedDateRange?.end;

    this.isSponsorNameSelected = true;
    this.getPayableBySponsorName();
  }

  getPayableBySponsorName(){
    this.sponsorService.getSponsorPayblesByStatusAndAssetName(this.selectedType,this.selectedSponsorByName?.id).subscribe(
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

  resetSponsorSelection(): void {
    this.selectedSponsorByName = null;
    this.selectedSponsorByNumber = null;
    this.totalAmount = 0;
    this.pendingAmount = 0;
    this.amount = null;
    this.remarks = '';
    this.showPaymentTable = false;
    this.showHistoryTable = false;
  }

  onPay(): void {

    const paymentPayload = {
      paidToType:"SPONSOR",
      paidToId:this.selectedSponsorByName?.id,
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
   const paidToType = "SPONSOR";
    this.expenseService.getPaymentsByFilter(this.selectedSponsorByName?.id,paidToType).subscribe(
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
