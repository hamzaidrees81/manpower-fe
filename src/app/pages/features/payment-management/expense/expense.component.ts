import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { FormatTextPipe } from '../../../../utils/format-text.pipe';

@Component({
  selector: 'ngx-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent {

  expenseDataTable: LocalDataSource = new LocalDataSource();

  expenseSetting = {
    actions: false,
    hideSubHeader: true,
    columns: {
      sponsorName: { title: 'Sponsor Name', valuePrepareFunction: (value) => new FormatTextPipe().transform(value), },
      sponsorshipAssetName: { title: 'Asset Name' },
      paidAmount: { title: 'Paid Amount' },
      sponsorshipDeterminant: { title: 'Determinant', valuePrepareFunction: (value) => new FormatTextPipe().transform(value), },
      sponsorshipPayable: { title: 'Payable Amount' },
      paymentStatus: { title: 'Payment Status', valuePrepareFunction: (value) => new FormatTextPipe().transform(value), },
      status: { title: 'Status' },
    },
  };
}
