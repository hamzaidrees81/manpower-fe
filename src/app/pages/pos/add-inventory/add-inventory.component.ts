import { Component } from '@angular/core';

@Component({
  selector: 'ngx-add-inventory',
  templateUrl: './add-inventory.component.html',
  styleUrls: ['./add-inventory.component.scss']
})
export class AddInventoryComponent {


  form = {
    shop: 'Khobar Shop',
    phone: '',
    name: '',
    address: '',
    vat: '',
    invoice: '',
    paymentMode: 'Cash'
  };
  
  shops = ['Khobar Shop', 'Dammam Branch'];
  suppliers = [
    { name: 'General Purchase', address: 'الخبر', vat: '000022222' },
    // Add more supplier objects here
  ];
  
  products = ['P22 - A/C OUTER FILTER DL', 'EC4MMBLK - ELECTRICAL C'];
  
  productRows = [
    { product: '', batch: '', storage: '', buyPrice: '', mrpPrice: '', srpPrice: '', stock: '', comment: '' },
  ];
  
  onSupplierChange(selectedName: string) {
    const selected = this.suppliers.find(s => s.name === selectedName);
    if (selected) {
      this.form.address = selected.address;
      this.form.vat = selected.vat;
    }
  }
  
  addRow() {
    this.productRows.push({ product: '', batch: '', storage: '', buyPrice: '', mrpPrice: '', srpPrice: '', stock: '', comment: '' });
  }
  
  removeRow(index: number) {
    this.productRows.splice(index, 1);
  }
  
}
