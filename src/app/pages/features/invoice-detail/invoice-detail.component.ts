import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../../@core/services/invoice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss']
})
export class InvoiceDetailComponent implements OnInit {
  selectedType: string = 'All'; 
  showDetails = false;
  invoiceData: any = { content: [], totalElements: 0, totalPages: 0 };
  pagedInvoices = [];
  currentPage = 1;
  pageSize = 10;

  constructor(private router: Router, private invoiceService: InvoiceService) {}

  ngOnInit(): void {}

  onClientSelect() {
    this.showDetails = false;
  }

  toggleDetails() {
    if (this.selectedType) {
      this.fetchInvoices(this.selectedType);
    }
  }

  fetchInvoices(selectedType: string): void {
    this.invoiceService.getInvoicesByStatus(selectedType, this.currentPage - 1, this.pageSize).subscribe(
      (data) => {
        if (data) {
          this.invoiceData = data;
          this.pagedInvoices = this.invoiceData?.content || [];
          this.showDetails = true;
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
    console.log('Edit:', invoice);
    const editData = {
      ...invoice,
      edit:'EDIT'
    }
    this.invoiceService.setInvoice(editData);
    this.router.navigate(['/pages/features/invoice']);
  }

  viewInvoice(invoice) {
    console.log('View:', invoice);
    const viewData = {
      ...invoice,
      view:'VIEW'
    }
    this.invoiceService.setInvoice(viewData);
    this.router.navigate(['/pages/features/invoice']);
  }

  printInvoice(invoice) {
    console.log('Print:', invoice);
    this.invoiceService.setInvoice(invoice);
    this.router.navigate(['/pages/features/print-invoice']);
  }
}
