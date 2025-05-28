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
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ngx-add-sale',
  templateUrl: './add-sale.component.html',
  styleUrls: ['./add-sale.component.scss']
})
export class AddSaleComponent {

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
  salelist;
  total: number;

  shopId;
  customerId;
  address;
  poNumber;
  dateCreated;
  cashReceived;
  paymentMode = "CASH";

  mode: 'add' | 'edit' | 'view' = 'add';
  isViewMode: boolean = false;
  id: any;



  constructor(private fb: FormBuilder, private saleService: AddSaleService, private router: Router, private toasterService: ToasterService, private dialogService: NbDialogService,
    private stockService: StockService,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private shopService: ShopService) { }



  onShopChange() {
    this.LoadStockBySale();
  }

  clearClient() {
    this.customerId = '';
    this.address = '';
  }

  clearShop() {
    this.shopId = '';
  }

  ngOnInit() {
    this.loadShops();
    this.loadClients();
    this.route.queryParams.subscribe(params => {
      const mode = params['mode'];
      const id = params['id'];

      if (mode === 'edit' || mode === 'view') {
        this.getSaleById(id);
      }

      if (mode === 'view') {
        this.isViewMode = true; // set this boolean to true in view mode
      }

      this.mode = mode; // optional: store mode for template control
      this.id = id;
    });

    if (this.mode != 'view' && this.mode != 'edit') {
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0];
      this.dateCreated = currentDate;
    }

  }

  getSaleById(id: number): void {
    this.saleService.getSalesById(id).subscribe({
      next: (data) => {
        this.salelist = data;
        this.shopId = this.salelist.shopId;
        this.customerId = this.salelist.customerId;
        this.address = this.salelist?.client?.address;
        // this.onClientChange(this.customerId);
        // this.address = this.salelist.address;
        this.paymentMode = this.salelist.paymentMode;
        this.cashReceived = this.salelist.receivedAmount;
        this.totalWithoutVat = this.salelist.totalBeforeVat;
        this.bulkDiscount = this.salelist.bulkDiscountPercentage;
        this.totalVatTax = this.salelist.vatAmount;
        this.poNumber = this.salelist.poNumber;
        const rawDate = this.salelist.saleDate;
        this.dateCreated = rawDate ? rawDate.split('T')[0] : '';

        this.cashReceived = this.salelist.cashReceived;
        this.paymentMode = this.salelist.paymentMode;
        this.total = this.salelist.totalAmount;


        this.selectedProduct = this.salelist?.saleItems?.map(item => {
          return {
            ...item,
            retailPrice: item.totalPrice,
            sellingPrice: item.soldPrice
          };
        });

      },
      error: (err) => {
        console.error('Error fetching sale by ID', err);
      }
    });
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

    editSale() {
  this.router.navigate(['/pages/pos/add-sale'], {
    queryParams: { id: this.id, mode: 'edit' }
  });
}

viewSale() {
  this.router.navigate(['/pages/pos/add-sale'], {
    queryParams: { id: this.id, mode: 'view' }
  });
}

printSale() {
  this.router.navigate(['/pages/pos/print-sale-invoice'], {
    queryParams: { id: this.id, mode: 'print' }
  });
}

  openStockSelector() {
    this.dialogService.open(SelectStockModalComponent, {
      context: {
        salelist: this.salelist,
        isSale: true,
        isSelectedShop: this.shopId ? true : false,
        initialSelected: this.selectedProduct || [],
        onSelectChange: (selectedItems: any[]) => {
          this.selectedProduct = [...selectedItems];
          this.selectedProduct = this.selectedProduct.map(item => ({
            ...item,
            sellingPrice: item.retailPrice,
            quantity: 1,
            total: 0
          }));
          for (let item of this.selectedProduct) {
            this.onDiscountChanged(item);
          }

        }
      },
    });
  }





  LoadStockBySale(): void {
    const shopId = this.shopId;
    this.stockService.getStocksByStatus("SALE", +shopId).subscribe(
      (data) => {
        this.salelist = data;
        this.salelist['isSale'] = true;
      },
      (error) => {
        console.error('Error loading clients:', error);
      }
    );
  }
  onClientChange(id: string) {
    const client = this.clients.find(c => c.id === +id);
    this.address = client?.address || '';
  }

  incrementQuantity(item: any): void {
    // Initialize quantity if not set
    if (item.quantity == null || isNaN(item.quantity)) {
      item.quantity = 0;
    }

    if (item.quantity < item.stockQty) {
      item.quantity += 1;
      this.recalculateOverallTotals();
    }
  }

  decrementQuantity(item: any): void {
    // Initialize quantity if not set
    if (item.quantity == null || isNaN(item.quantity)) {
      item.quantity = 1;
    }

    if (item.quantity > 1) {
      item.quantity -= 1;
      this.recalculateOverallTotals();
    }
  }


  onSellingPriceChanged(item: any): void {
    const retail = item.retailPrice || item.product?.retailPrice || 0;
    if (retail > 0) {
      const discount = ((retail - item.sellingPrice) / retail) * 100;
      item.discount = +discount.toFixed(2);
    } else {
      item.discount = 0;
    }

    this.recalculateOverallTotals();
  }

  onDiscountChanged(item: any): void {
    const retail = item.retailPrice || item.product?.retailPrice || 0;
    if (retail > 0) {
      item.sellingPrice = +(retail * (1 - (item.discount || 0) / 100)).toFixed(2);
    } else {
      item.sellingPrice = 0;
    }

    this.recalculateOverallTotals();
  }


  getLineTotal(item: any): number {
    const qty = item.quantity || 1;
    const price = item.sellingPrice || 0;
    const discount = item.discount || 0;
    const lineTotal = qty * price * (1 - discount / 100);
    return parseFloat(lineTotal.toFixed(2));
  }

  calculateSubtotal(): number {
    return this.selectedProduct.reduce((sum, item) => {
      return sum + (item.sellingPrice * item.quantity);
    }, 0);
  }

  reapplyDiscountsToRows(): void {
    if (!this.selectedProduct || this.selectedProduct.length === 0) return;

    const discountRate = (this.bulkDiscount || 0) / 100;

    for (let item of this.selectedProduct) {
      if (!item.retailPrice || item.retailPrice <= 0) continue;

      item.discount = parseFloat((discountRate * 100).toFixed(2)); // update discount %
      item.sellingPrice = parseFloat((item.retailPrice * (1 - discountRate)).toFixed(2)); // recalculate selling price
      item.manualDiscount = false; // mark as auto
    }
  }



  onTotalChanged(): void {
    const rawSubtotal = this.calculateSubtotal(); // sum of sellingPrice * quantity
    if (rawSubtotal === 0) {
      this.bulkDiscount = 0;
      return;
    }

    // Remove VAT from entered total to get net
    const expectedNet = this.total / (1 + this.vatRate / 100);
    const calculatedDiscount = ((rawSubtotal - expectedNet) / rawSubtotal) * 100;

    this.bulkDiscount = parseFloat(calculatedDiscount.toFixed(2));

    this.reapplyDiscountsToRows();
    this.recalculateOverallTotals();
  }


  recalculateOverallTotals(): void {
    let subtotal = 0;
    for (const item of this.selectedProduct) {
      if (!item.quantity || item.quantity < 1) item.quantity = 1;
      subtotal += this.getLineTotal(item);
    }

    const discountedSubtotal = subtotal * (1 - (this.bulkDiscount || 0) / 100);
    this.totalWithoutVat = parseFloat(discountedSubtotal.toFixed(2));
    this.totalVatTax = parseFloat((this.totalWithoutVat * this.vatRate / 100).toFixed(2));
    this.total = parseFloat((this.totalWithoutVat + this.totalVatTax).toFixed(2));
    this.cashReceived = this.total;
  }

  removeItem(index: number): void {
    this.selectedProduct.splice(index, 1);

    if (this.selectedProduct.length === 0) {
      this.totalWithoutVat = 0;
      this.totalVatTax = 0;
      this.bulkDiscount = 0;
      this.total = 0;
      this.cashReceived = 0;
    } else {
      this.recalculateOverallTotals();
    }
  }

  onBulkDiscountChanged(): void {
    this.reapplyDiscountsToRows();
    this.recalculateOverallTotals();
  }



  goBack() {
    this.router.navigate(['/pages/pos/view-sale']);
    this.resetForm();
  }

  resetForm() {
    this.shopId = null;
    this.customerId = null;
    this.address = '';
    this.poNumber = '';
    this.dateCreated = null;
    this.cashReceived = null;
    this.paymentMode = '';

    this.isViewMode = false;
    this.selectedProduct = [];
  }


  submitSale() {
    const shopId = this.shopId;
    const customerId = this.customerId;


    // Validate required fields
    if (!shopId) {
      this.toasterService.showError('Please select a selling shop.');
      return;
    }

    if (!this.selectedProduct || this.selectedProduct.length === 0) {
      this.toasterService.showError('Please select at least one product.');
      return;
    }

    const localDateTime = this.dateCreated; // e.g. "2025-05-27T08:08"
    const utcDateTime = new Date(localDateTime).toISOString();

    const payload = {
      shopId: +shopId,
      customerId: +customerId,
      poNumber: this.poNumber,
      status: 'ACTIVE',
      saleDate: utcDateTime,
      // paymentMode: this.paymentMode,
      paidAmount: this.cashReceived,
      receivedAmount: this.cashReceived,
      paymentMode: this.paymentMode,
      // bankName: this.paymentMode === 'Bank' ? this.bankName : null,
      // bankTransactionId: this.paymentMode === 'Bank' ? this.bankTransactionId : null,
      // dueDate: this.paymentMode === 'Credit' ? this.dueDate : null,
      saleItems: this.selectedProduct?.map(item => ({
        productId: item.product?.id,
        quantity: item.quantity,
        unitPrice: item.retailPrice,
        soldPrice: item.sellingPrice,
        discount: item.discount,
        totalPrice: this.getLineTotal(item),
        tax: 0
      })),
      bulkDiscountPercentage: this.bulkDiscount || 0,
      discountPercentage: this.vatRate || 0,
      totalBeforeVat: this.totalWithoutVat || 0,
      totalAmount: this.total || 0,
      vatAmount: this.totalVatTax //confirm
    };


    // Now send to backend
    this.saleService.addSale(payload).subscribe({
      next: (res) => {
        this.toasterService.showSuccess('Sale created successfully!');
        this.router.navigate(['/pages/pos/view-sale'])
      },
      error: (err) => {
        this.toasterService.showError('Failed to create sale.');
      }
    });
  }

}