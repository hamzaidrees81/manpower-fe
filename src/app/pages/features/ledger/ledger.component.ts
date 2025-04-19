import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../../@core/services/expense.service';
import { FormatTextPipe } from '../../../utils/format-text.pipe';
import { LocalDataSource } from 'ng2-smart-table';
import { CustomDatepickerComponent } from '../../../shared/custom-datepicker/custom-datepicker.component';
import { SmartTableDatepickerRenderComponentComponent } from '../../../shared/smart-table-datepicker-render-component/smart-table-datepicker-render-component.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ngx-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss']
})
export class LedgerComponent implements OnInit {

  paymentMethod;
  paymentDirection;
  paymentType;
  getLedgersList;
  selectedPaidToTypes;
  selectedDateRange;


    historyTableData: LocalDataSource = new LocalDataSource();
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
        mainAccountName: {
          title: 'Account Name',
          type: 'string',
          filter: false
        },
        paidToName: {
          title: 'Name',
          type: 'string',
          filter: false
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
          type: 'html', // required!
          filter: false,
          valuePrepareFunction: (value, row) => {
            const className = row.paymentDirection === 'OUTGOING' ? 'text-danger' : 'text-success';
            const html = `<span class="${className}">${value}</span>`;
            return this.sanitizer.bypassSecurityTrustHtml(html);
          }
        },
        paymentDirection: {
          title: 'Dir',
          type: 'string',
          filter: false,
          valuePrepareFunction: (value) => new FormatTextPipe().transform(value),
        },
      }
    };

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

  paymentDirections = [
    { key: 'INCOMING', label: 'Incoming' },
    { key: 'OUTGOING', label: 'Outgoing' }
  ];

  paymentTypes = [
    { key: 'INITIAL', label: 'Initial' },
    { key: 'ADJUSTMENT', label: 'Adjustment' },
    { key: 'FULL', label: 'Full' },
    { key: 'REFUND', label: 'Refund' },
    { key: 'ADVANCE', label: 'Advance' }
  ];

  paidToTypes = [
    { key: 'ASSET', label: 'Asset' },
    { key: 'SPONSOR', label: 'Sponsor' },
    { key: 'EXPENSE', label: 'Expense' },
    { key: 'INVOICE', label: 'Invoice' }, // added hint
    { key: 'OTHER', label: 'Other' }
  ];
  startDate: any;
  endDate: any;

  constructor(private paymentService : ExpenseService,private sanitizer: DomSanitizer){}

  ngOnInit(): void {
      this.toggleDetails();
  }

   formatDateToLocal(date: Date): string {
    if(date){
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${date?.getFullYear()}-${pad(date?.getMonth() + 1)}-${pad(date?.getDate())}`;
    }

  }
  
  toggleDetails(): void {
    this.selectedDateRange;
    this.startDate = this.selectedDateRange?.start;
    this.endDate = this.selectedDateRange?.end;
    this.paymentService.getLedgers(this.paymentMethod,this.paymentDirection,this.paymentType,this.selectedPaidToTypes,this.formatDateToLocal(this.startDate),this.formatDateToLocal(this.endDate)).subscribe(
      (data) => {
        if (data) {
          this.getLedgersList = data;
          this.historyTableData.load(this.getLedgersList?.payments);    
        }
      },
      (error) => {
        console.error('Error loading invoices:', error);
      }
    );
  }
}
