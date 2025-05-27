

import { Component, Input, OnInit } from '@angular/core';
import { InvoiceService } from '../../../@core/services/invoice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AddSaleService } from '../../../@core/services/pos-services/add-sale.service';

@Component({
  selector: 'ngx-print-sale-invoice',
  templateUrl: './print-sale-invoice.component.html',
  styleUrls: ['./print-sale-invoice.component.scss']
})
export class PrintSaleInvoiceComponent implements OnInit {
  invoiceData: any;
  saleList;
  mode: any;
  qrCodeImageUrl: SafeUrl;

  
  constructor(private route: ActivatedRoute,private saleService:AddSaleService,private router:Router,private sanitizer: DomSanitizer){}

  ngOnInit() {
        this.route.queryParams.subscribe(params => {
      const invoiceId = params['id'];
      this.mode = params['mode'];
      if (invoiceId) {
        this.getSaleById(invoiceId);
      }
    });

  }
  
  getSaleById(id): void {
    if(!id){
        this.router.navigate(['/pages/pos/view-sale']); 
    }
    this.saleService.getSalesById(id).subscribe(
      (data) => {
        this.saleList = data;
        this.qrCodeImageUrl = this.getQrCodeImage(this.saleList.qrcode); // ✅ Only call once
        
      },
      (error) => {
        console.error('Error loading sale:', error);
      }
    );
  }

    backToInvoice(){
 this.router.navigate(['/pages/pos/view-sale']);
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