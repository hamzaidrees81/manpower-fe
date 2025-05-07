import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../../@core/services/invoice.service';
import { Router } from '@angular/router';
import { ClientService } from '../../../@core/services/client.service';
import { ExpenseService } from '../../../@core/services/expense.service';
import { ToasterService } from '../../../@core/services/toaster.service';
import { CustomDatepickerComponent } from '../../../shared/custom-datepicker/custom-datepicker.component';
import { SmartTableDatepickerRenderComponentComponent } from '../../../shared/smart-table-datepicker-render-component/smart-table-datepicker-render-component.component';
import { FormatTextPipe } from '../../../utils/format-text.pipe';
import { LocalDataSource } from 'ng2-smart-table';
import { AccountsService } from '../../../@core/services/accounts.service';

@Component({
  selector: 'ngx-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss']
})
export class InvoiceDetailComponent implements OnInit {
  selectedType: string = 'ALL'; 
  showDetails = false;
  selectedClientByName;
  selectedInvoiceByName;
  isClientNameSelected = false;
  noRecordFound= false;
  showHistoryTable = false;
  invoiceData: any = { content: [], totalElements: 0, totalPages: 0 };
  pagedInvoices;
  currentPage = 1;
  pageSize = 10;

  amount: number | null = null;
  remarks: string = '';
  mainAccountId;
  invoiceId;
  paymentDate: Date = new Date();
  paymentMethod: { label: string; value: string } | null = null;
  reference: string = '';
  paymentType: { label: string; value: string } | null = null;

  totalAmount = 0;
  pendingAmount = 0;
  paidAmount = 0;

   historyTableData: LocalDataSource = new LocalDataSource();
   
  getClientsList;
  getInvoicesList: any[];

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
  getAccounts: any;

  constructor(private toasterService: ToasterService,private expenseService : ExpenseService,private router: Router, private invoiceService: InvoiceService , private clientService : ClientService,private accountsService : AccountsService) {}

  ngOnInit(): void {
    this.getClients();
    this.getInvoices();
  }

  onClientSelect() {
    this.showDetails = false;
    this.isClientNameSelected = false;
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

  getClients(){
    this.clientService.getClients().subscribe(
      (data) => {
        this.getClientsList = data;
      },
      (error) => {
        console.error('Error loading projects:', error);
      }
    );
  }

  getInvoices(){
    this.invoiceService.getInvoices().subscribe(
      (data) => {
        this.getInvoicesList = data;
      },
      (error) => {
        console.error('Error loading projects:', error);
      }
    );
  }

  toggleDetails() {
    if (this.selectedType || this.selectedClientByName) {
      this.fetchInvoices(this.selectedType,this.selectedClientByName?.id);
    }
  }

  fetchInvoices(selectedType,clientId?): void {
    this.invoiceService.getInvoicesByStatus(selectedType,clientId, this.currentPage - 1, this.pageSize).subscribe(
      (data) => {
        if (data) {
          this.invoiceData = data;
          this.pagedInvoices = this.invoiceData?.page || [];
          if(this.pagedInvoices?.content?.length > 0){
            this.noRecordFound = true;
          }
          if(this.selectedClientByName){
            this.isClientNameSelected = true;
            this.showDetails = true;
            this.loadAccount();
            this.getHistory();
          }else {
            this.showDetails = true;
          }       
        }
      },
      (error) => {
        console.error('Error loading invoices:', error);
      }
    );
  }

  changePage(page: number) {
    this.currentPage = page;
    this.fetchInvoices(this.selectedType);
  }

  editInvoice(invoice) {
    const editData = {
      ...invoice,
      edit:'EDIT'
    }
    this.invoiceService.setInvoice(editData);
    this.router.navigate(['/pages/features/invoice']);
  }

  viewInvoice(invoice) {
    const viewData = {
      ...invoice,
      view:'VIEW'
    }
    this.invoiceService.setInvoice(viewData);
    this.router.navigate(['/pages/features/invoice']);
  }

  printInvoice(invoice) {
    this.invoiceService.setInvoice(invoice);
    this.router.navigate(['/pages/features/print-invoice']);
  }

  onPay(): void {

    const paymentPayload = {
      paidToType:"INVOICE",
      paidToId:this.selectedClientByName?.id,
      invoiceId:this.invoiceId,
      amount: this.amount,
      mainAccountId:this.mainAccountId,
      remarks: this.remarks,
      paymentDate: this.paymentDate ? this.paymentDate.toISOString() : null,
      paymentMethod: this.paymentMethod,
      reference: this.reference,
      status:"COMPLETED",
      paymentDirection:"INCOMING",
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
   const paidToType = "INVOICE";
    this.expenseService.getPaymentsByFilter(this.selectedClientByName?.id,paidToType).subscribe(
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
