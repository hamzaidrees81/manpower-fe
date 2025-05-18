

import { Component, Input, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import { InvoiceService } from '../../../@core/services/invoice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'ngx-print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['./print-invoice.component.scss']
})
export class PrintInvoiceComponent implements OnInit {
  invoiceData: any;
  invoiceList;
  mode: any;
  qrCodeImageUrl: SafeUrl;

  
  constructor(private route: ActivatedRoute,private invoiceService : InvoiceService,private router:Router,private sanitizer: DomSanitizer){}

  ngOnInit() {
        this.route.queryParams.subscribe(params => {
      const invoiceId = params['id'];
      this.mode = params['mode'];
      if (invoiceId) {
        this.loadInvoiceData(invoiceId);
      }
    });

  }
  loadInvoiceData(id): void {
    if(!id){
        this.router.navigate(['/pages/features/invoice']); 
    }
    this.invoiceService.getInvoiceById(id).subscribe(
      (data) => {
        this.invoiceList = data;
        this.qrCodeImageUrl = this.getQrCodeImage(this.invoiceList.qrcode); // ✅ Only call once
        
      },
      (error) => {
        console.error('Error loading clients:', error);
      }
    );
  }

    backToInvoice(){
 this.router.navigate(['/pages/features/invoice']);
  }

  getQrCodeImage(base64: string): SafeUrl | null {
    if (!base64) return null;
  
    // Remove data:image/png;base64, if it exists
    const cleaned = base64.replace(/^data:image\/(png|jpeg);base64,/, '');
  
    try {
      const byteCharacters = atob(cleaned);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      return this.sanitizer.bypassSecurityTrustUrl(url);
    } catch (err) {
      console.error('Invalid base64:', err);
      return null;
    }
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