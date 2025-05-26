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
  totalVatTax: number = 0;
  vatRate: number = 15; // fixed

  selectedProduct;
  shops: any[];
  clients: any[];
  salelist: any[];
  total: number;

  constructor(private fb: FormBuilder, private saleService: AddSaleService, private toasterService: ToasterService, private dialogService: NbDialogService,
    private stockService: StockService,
    private clientService: ClientService,
    private shopService: ShopService) {
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


  ngOnInit() {
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
         isSale: true, 
        initialSelected: this.selectedProduct || [],
        onSelectChange: (selectedItems: any[]) => {
          this.selectedProduct = [...selectedItems];
          this.selectedProduct = this.selectedProduct.map(item => ({
            ...item,
            sellingPrice: item.retailPrice,
            total: 0
          }));
this.recalculateOverallTotals();
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
    if (item.quantity < item.product.stockQty) {
      item.quantity += 1;
      this.recalculateOverallTotals();
    }
  }

  decrementQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.recalculateOverallTotals();
    }
  }

  onTotalChanged(): void {
    const subtotal = this.calculateSubtotal(); // without discount
    const newBulkDiscount = subtotal - (this.total / 1.15); // remove VAT first
    this.bulkDiscount = newBulkDiscount;

    this.reapplyDiscountsToRows();
    this.recalculateOverallTotals();
  }


  calculateSubtotal(): number {
    return this.selectedProduct.reduce((sum, item) => {
      return sum + (item.sellingPrice * item.quantity);
    }, 0);
  }


  reapplyDiscountsToRows(): void {
    const subtotal = this.calculateSubtotal();

    if (subtotal <= 0) return;

    for (let item of this.selectedProduct) {
      const itemLineTotal = item.sellingPrice * item.quantity;
      const itemShare = itemLineTotal / subtotal;
      const itemDiscountAmount = this.bulkDiscount * itemShare;

      const priceBeforeDiscount = item.sellingPrice;
      const effectiveDiscountPercent = (itemDiscountAmount / (priceBeforeDiscount * item.quantity)) * 100;

      item.discount = +effectiveDiscountPercent.toFixed(2);
    }
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
    this.totalVatTax = parseFloat((this.totalWithoutVat * this.vatRate / 100).toFixed(2));
    this.total = parseFloat((this.totalWithoutVat + this.totalVatTax).toFixed(2));
  }


  submitSale() {

 const shopId = this.form.value.shopName;
 const customerId = this.form.value.client;
    const payload = {
      shopId: +shopId,
  customerId: +customerId,
      poNumber: this.form.value.poNumber,
      status:'ACTIVE',
      saleDate: this.form.value.dateCreated,
      // paymentMode: this.form.value.paymentMode,
      paidAmount: this.form.value.paymentMode === 'Cash' ? this.form.value.cashReceived : null,
      // bankName: this.form.value.paymentMode === 'Bank' ? this.form.value.bankName : null,
      // bankTransactionId: this.form.value.paymentMode === 'Bank' ? this.form.value.bankTransactionId : null,
      // dueDate: this.form.value.paymentMode === 'Credit' ? this.form.value.dueDate : null,
      saleItems: this.selectedProduct?.map(item => ({
        productId: item.product?.id,
        quantity: item.quantity,
        unitPrice: item.retailPrice,
        soldPrice: item.sellingPrice,
        discount: item.discount,
        totalPrice: this.getLineTotal(item),
        tax:0
      })),
      bulkDiscount: this.bulkDiscount || 0,
      discountPercentage: this.vatRate || 0,
      totalBeforeVat: this.totalWithoutVat || 0,
      totalAmount: this.total || 0,
      vatAmount:this.totalVatTax //confirm
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