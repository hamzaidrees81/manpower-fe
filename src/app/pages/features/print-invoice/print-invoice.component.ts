

import { Component, Input, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import { InvoiceService } from '../../../@core/services/invoice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['./print-invoice.component.scss']
})
export class PrintInvoiceComponent implements OnInit {
  invoiceData: any;
  invoiceList;

  
  constructor(private invoiceService : InvoiceService,private router:Router){}

  ngOnInit() {
    this.invoiceData = this.invoiceService.getInvoice();
    this.loadInvoiceData(this.invoiceData?.id)

  }
  loadInvoiceData(id): void {
    if(!id){
        this.router.navigate(['/pages/features/invoice']); 
    }
    this.invoiceService.getInvoiceById(id).subscribe(
      (data) => {
        this.invoiceList = data;
      },
      (error) => {
        console.error('Error loading clients:', error);
      }
    );
  }

  printInvoice() {
    const printContents = document.getElementById('invoiceSection')?.innerHTML;
    const originalContents = document.body.innerHTML;
  
    document.body.innerHTML = printContents || '';
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // Ensures the page returns to its original state
  }
  

  
}