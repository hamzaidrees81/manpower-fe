

import { Component, Input } from '@angular/core';
import html2canvas from 'html2canvas';

@Component({
  selector: 'ngx-print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['./print-invoice.component.scss']
})
export class PrintInvoiceComponent {
  invoiceData = {
    company: {
      name: 'East Repair Inc.',
      address: '1912 Harvest Lane',
      city: 'New York, NY 12210',
      zip: '12210'
    },
    invoiceNumber: 'US-001',
    date: '11/02/2019',
    dueDate: '26/02/2019',
    customer: {
      name: 'John Smith',
      address: '2 Court Square',
      city: 'New York, NY 12210',
      zip: '12210'
    },
    shipping: {
      name: 'John Smith',
      address: '3787 Pineview Drive',
      city: 'Cambridge, MA 12210',
      zip: '12210'
    },
    items: [
      { qty: 1, description: 'Front and rear brake cables', unitPrice: 100, amount: 100 },
      { qty: 2, description: 'New set of pedal arms', unitPrice: 15, amount: 30 },
      { qty: 3, description: 'Labor 3hrs', unitPrice: 5, amount: 15 }
    ],
    subtotal: 145,
    taxRate: 6.25,
    tax: 9.06,
    total: 154.06,
    terms: 'Payment is due within 15 days. Please make checks payable to: East Repair Inc.'
  };
  
  
    printInvoice() {
      const printContent = document.getElementById('invoice-content');
      if (printContent) {
        const printWindow = window.open('', '', 'width=800,height=600');
        if (printWindow) {
          printWindow.document.write('<html><head><title>Print Invoice</title>');
          printWindow.document.write('<style>');
          printWindow.document.write(`
            body { font-family: Arial, sans-serif; }
            .invoice-container { width: 100%; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #2d4e85; color: white; }
            .total-section { text-align: right; margin-top: 20px; font-weight: bold; }
          `);
          printWindow.document.write('</style></head><body>');
          printWindow.document.write(printContent.innerHTML);
          printWindow.document.write('</body></html>');
          printWindow.document.close();
          printWindow.print();
        }
      }
    }
  }
  