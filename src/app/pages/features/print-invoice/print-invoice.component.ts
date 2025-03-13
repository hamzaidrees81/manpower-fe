

import { Component, Input, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import { InvoiceService } from '../../../@core/services/invoice.service';

@Component({
  selector: 'ngx-print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['./print-invoice.component.scss']
})
export class PrintInvoiceComponent implements OnInit {
  invoiceData: any;

  
  constructor(private invoiceService : InvoiceService){}

  ngOnInit() {
    this.invoiceData = this.invoiceService.getInvoice();
    console.log(" this.invoiceData", JSON.stringify(this.invoiceData));

    if (!this.invoiceData) {
      console.warn('No invoice data found! Fetching from API if needed.');
      // Fetch from API if the page was loaded directly
      // this.fetchInvoiceFromApi();
    }
  }

  printInvoice() {
    window.print(); // Triggers the print dialog
  }
}