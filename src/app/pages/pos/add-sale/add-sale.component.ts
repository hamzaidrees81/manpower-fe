// add-sale.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddSaleService } from '../../../@core/services/pos-services/add-sale.service';
import { ToasterService } from '../../../@core/services/toaster.service';
import { NbDialogService } from '@nebular/theme';
import { ClientService } from '../../../@core/services/client.service';
import { ShopService } from '../../../@core/services/pos-services/shop.service';
import { StockService } from '../../../@core/services/pos-services/stock.service';
import { SelectStockModalComponent } from '../../../shared/select-stock-modal/select-stock-modal.component';

@Component({
  selector: 'ngx-add-sale',
  templateUrl: './add-sale.component.html',
  styleUrls: ['./add-sale.component.scss']
})
export class AddSaleComponent {
  form: FormGroup;

  selectedItem: any = null;

  sellingPrice = 0;
  discount = 0;
  bulkDiscount = 0;
  totalWithoutVat = 0;
  vatTax: number = 0;
  vatRate: number = 15; // fixed

  selectedProduct;
  shops: any[];
  clients: any[];
  salelist: any[];
  total: number;

  constructor(private fb: FormBuilder ,private saleService:AddSaleService, private toasterService: ToasterService,   private dialogService: NbDialogService,
    private stockService: StockService,
    private clientService: ClientService,
    private shopService:ShopService) {
    this.form = this.fb.group({
      shopName: '',
      client: '',
      shopAddress: '',
      dateCreated: '',
      poNumber: '',
      paymentMode: 'Cash'
    });
  }

  removeItem(index: number): void {
  this.selectedProduct.splice(index, 1);
}


  ngOnInit(){
        this.loadShops();
    this.loadClients();
    this.LoadStockBySale();
  }
  
    loadShops(): void {
    this.shopService.getShops().subscribe(
      (data) => {
       this.shops = data;
      },
      (error) => {
        console.error('Error loading clients:', error);
      }
    );
  }

  loadClients(): void {
    this.clientService.getClients().subscribe(
      (data) => {
       this.clients = data;
      },
      (error) => {
        console.error('Error loading clients:', error);
      }
    );
  }

  
openStockSelector() {
  this.dialogService.open(SelectStockModalComponent, {
    context: {
      salelist: this.salelist,
      initialSelected: this.selectedProduct || [],
      onSelectChange: (selectedItems: any[]) => {
        this.selectedProduct = [...selectedItems];
        this.selectedProduct = this.selectedProduct.map(item => ({
  ...item,
  total: 0
}));

      }
    },
  });
}





    LoadStockBySale(): void {
    this.stockService.getStocksByStatus("SALE").subscribe(
      (data) => {
       this.salelist = data;
       this.salelist['isSale'] = true;
      },
      (error) => {
        console.error('Error loading clients:', error);
      }
    );
  }
  onClientChange(clientName: string) {
    const client = this.clients.find(c => c.name === clientName);
    this.form.patchValue({ shopAddress: client?.address || '' });
  }

  incrementQuantity(item: any): void {
  item.quantity += 1;
  this.recalculateOverallTotals();
}

decrementQuantity(item: any): void {
  item.quantity = Math.max(1, item.quantity - 1);
  this.recalculateOverallTotals();
}


getLineTotal(item: any): number {
  const qty = item.quantity || 0;
  const price = item.sellingPrice || 0;
  const discount = item.discount || 0;
  const lineTotal = qty * price * (1 - discount / 100);
  return parseFloat(lineTotal.toFixed(2));
}

recalculateOverallTotals(): void {
  let subtotal = 0;
  for (const item of this.selectedProduct) {
    subtotal += this.getLineTotal(item);
  }

  const discountedSubtotal = subtotal * (1 - (this.bulkDiscount || 0) / 100);
  this.totalWithoutVat = parseFloat(discountedSubtotal.toFixed(2));
  this.vatTax = parseFloat((this.totalWithoutVat * this.vatRate / 100).toFixed(2));
  this.total = parseFloat((this.totalWithoutVat + this.vatTax).toFixed(2));
}


  submitSale() {
  if (!this.form.value || this.selectedProduct.length === 0) {
    console.warn('Form is incomplete or no items selected.');
    return;
  }

  const payload = {
    shopName: this.form.value.shopName,
    client: this.form.value.client,
    poNumber: this.form.value.poNumber,
    shopAddress: this.form.value.shopAddress,
    dateCreated: this.form.value.dateCreated,
    paymentMode: this.form.value.paymentMode,
    cashReceived: this.form.value.paymentMode === 'Cash' ? this.form.value.cashReceived : null,
    bankName: this.form.value.paymentMode === 'Bank' ? this.form.value.bankName : null,
    bankTransactionId: this.form.value.paymentMode === 'Bank' ? this.form.value.bankTransactionId : null,
    dueDate: this.form.value.paymentMode === 'Credit' ? this.form.value.dueDate : null,
    items: this.selectedProduct.map(item => ({
      productId: item.product?.id,
      productName: item.product?.name,
      quantity: item.quantity,
      retailPrice: item.retailPrice,
      sellingPrice: item.sellingPrice,
      discount: item.discount,
      lineTotal: this.getLineTotal(item)
    })),
    bulkDiscount: this.bulkDiscount || 0,
    vatTax: this.vatTax || 0,
    totalWithoutVat: this.totalWithoutVat || 0,
    total: this.total || 0
  };

  console.log('Submitting payload:', payload);

  // Now send to backend
  this.saleService.addSale(payload).subscribe({
    next: (res) => {
      this.toasterService.showSuccess('Sale created successfully!');
    },
    error: (err) => {
       this.toasterService.showError('Failed to create sale.');
    }
  });
}

}