// add-sale.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddSaleService } from '../../../@core/services/pos-services/add-sale.service';
import { ToasterService } from '../../../@core/services/toaster.service';

@Component({
  selector: 'ngx-add-sale',
  templateUrl: './add-sale.component.html',
  styleUrls: ['./add-sale.component.scss']
})
export class AddSaleComponent {
  form: FormGroup;

  saleItems = [
    { name: 'منتج 1 / Item 1', qty: 1, price: 100 },
    { name: 'منتج 2 / Item 2', qty: 2, price: 150 },
  ];

 



  shops = ['Dammam Shop', 'Riyadh Shop'];
  clients = [
    {
      name: 'CONSORTIUM OF NESMA',
      shopAddress: 'Al-Khobar, Northern Khobar, Prince Majid bin Abdul Aziz, 34427, Saudi Arabia'
    },
    { name: 'Ali', shopAddress: 'Street 12, Dammam' },
    { name: 'Sara', shopAddress: 'Street 34, Riyadh' }
  ];

  products = [
    { name: '100 METER AIR HOSE 3/8"', retail: 6500, stock: 5 },
    { name: 'WRENCH SET 10PCS', retail: 350, stock: 12 },
    { name: 'ELECTRIC DRILL 500W', retail: 1200, stock: 8 }
  ];


  selectedItem: any = null;
  saleQty = 1;
  sellingPrice = 0;
  discount = 0;
  bulkDiscount = 0;

  filteredProducts = [];
  selectedProduct: string = '';

  constructor(private fb: FormBuilder ,private saleService:AddSaleService, private toasterService: ToasterService) {
    this.form = this.fb.group({
      shopName: '',
      client: 'CONSORTIUM OF NESMA AND PARTNERS - SICIM SAUDI ARABIA',
      shopAddress: 'Al-Khobar, Northern Khobar, Prince Majid bin Abdul Aziz, 34427, Saudi Arabia',
      dateCreated: '',
      poNumber: '123',
      paymentMode: 'Cash'
    });
  }

  ngOnInit(){
    this.filteredProducts = [...this.products];
  }
  
    // Update filteredProducts as the user types
    onInputChange(value: string): void {
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(value.toLowerCase())
      );
    }
  onClientChange(clientName: string) {
    const client = this.clients.find(c => c.name === clientName);
    this.form.patchValue({ shopAddress: client?.shopAddress || '' });
  }

  onProductSelect(productName: string) {
    this.selectedItem = this.products.find(p => p.name === productName);
    if (this.selectedItem) {
      this.sellingPrice = this.selectedItem.retail;
      this.saleQty = 1;
      this.discount = 0;
    }
  }

  calculateLineTotal(): number {
    return this.saleQty * this.sellingPrice * (1 - this.discount / 100);
  }

  get subtotal(): number {
    return this.calculateLineTotal();
  }

  get tax(): number {
    return this.subtotal * 0.15;
  }

  get total(): number {
    return (this.subtotal * (1 - this.bulkDiscount / 100)) + this.tax;
  }

  submitSale(){

    const content = {

      totalAmount: this.form.get('totalAmount')?.value,
      status: this.form.get('status')?.value,
      customerId: this.form.get('customerId')?.value,
      saleDate: this.form.get('saleDate')?.value,
      shopId: this.form.get('shopId')?.value,
      poNumber: this.form.get('poNumber')?.value,
    
      shop: {
        shopName: this.form.get('shop.shopName')?.value,
        shopAddress: this.form.get('shop.shopAddress')?.value,
        shopPhone1: this.form.get('shop.shopPhone1')?.value,
        shopPhone2: this.form.get('shop.shopPhone2')?.value,
        comments: this.form.get('shop.comments')?.value,
        status: this.form.get('shop.status')?.value,
        dateCreated: this.form.get('shop.dateCreated')?.value,
    
        // company: {
        //   id: this.form.get('shop.company.id')?.value,
        //   name: this.form.get('shop.company.name')?.value,
        //   shopAddress: this.form.get('shop.company.shopAddress')?.value,
        //   maxAssetCount: this.form.get('shop.company.maxAssetCount')?.value,
        //   headerImageUrl: this.form.get('shop.company.headerImageUrl')?.value,
        //   footerImageUrl: this.form.get('shop.company.footerImageUrl')?.value,
        //   bankAccountTitle: this.form.get('shop.company.bankAccountTitle')?.value,
        //   bankAccountNumber: this.form.get('shop.company.bankAccountNumber')?.value,
        //   bankIban: this.form.get('shop.company.bankIban')?.value,
        //   bankName: this.form.get('shop.company.bankName')?.value,
        //   status: this.form.get('shop.company.status')?.value,
        //   vat: this.form.get('shop.company.vat')?.value,
        // }
      },
    
      payments: this.form.get('payments')?.value || [],
    
      saleItems: this.form.get('saleItems')?.value || [],
    };
    
    
    
    this.saleService.addSale(content).subscribe(
      (data) => {
        this.toasterService.showSuccess('Sale created successfully!');
      },
      (error) => {
        this.toasterService.showError('Failed to create sale.');
      }
    );
  }
}
