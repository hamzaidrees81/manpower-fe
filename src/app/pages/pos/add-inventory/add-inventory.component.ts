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
import { SupplierService } from '../../../@core/services/pos-services/supplier.service';
import { AddPurchaseService } from '../../../@core/services/pos-services/add-purchase.service';

@Component({
  selector: 'ngx-add-inventory',
  templateUrl: './add-inventory.component.html',
  styleUrls: ['./add-inventory.component.scss']
})
export class AddInventoryComponent{

  selectedItem: any = null;

  sellingPrice = 0;
  discount = 0;
  bulkDiscount = 0;
  totalWithoutVat = 0;
  totalVatTax: number = 0;
  vatRate: number = 15; // fixed

  selectedProduct;
  shops: any[];
  supplier: any[];
  salelist;
  total: number;

  shopId;
  supplierId;
  address;
  supplierInvoiceNo;
  purchaseDate;
  cashReceived;
  paymentMode;

  mode: 'add' | 'edit' | 'view' = 'add';
  isViewMode: boolean = false;



  constructor(private fb: FormBuilder, private purchaseService: AddPurchaseService, private router: Router, private toasterService: ToasterService, private dialogService: NbDialogService,
    private stockService: StockService,
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private shopService: ShopService) { }

  removeItem(index: number): void {
    this.selectedProduct.splice(index, 1);
  }

  onShopChange() {
    this.LoadStockBySale();
  }

  clearClient() {
    this.supplierId = '';
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
    });

    if (this.mode != 'view' && this.mode != 'edit') {
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0];
      this.purchaseDate = currentDate;
    }

  }

  getSaleById(id: number): void {
    this.purchaseService.getPurchaseById(id).subscribe({
      next: (data) => {
        this.salelist = data;
        this.shopId = this.salelist.shopId;
        this.supplierId = this.salelist.supplierId;
        this.address = this.salelist?.client?.address;
        // this.onClientChange(this.supplierId);
        // this.address = this.salelist.address;
        this.supplierInvoiceNo = this.salelist.supplierInvoiceNo;
        const rawDate = this.salelist.saleDate;
this.purchaseDate = rawDate ? rawDate.split('T')[0] : '';

        this.cashReceived = this.salelist.cashReceived;
        this.paymentMode = this.salelist.paymentMode;
        this.total = this.salelist.totalAmount;
        

       this.selectedProduct = this.salelist?.items?.map(item => {
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
        console.error('Error loading shops:', error);
      }
    );
  }

  loadClients(): void {
    this.supplierService.getSuppliers().subscribe(
      (data) => {
        this.supplier = data;
      },
      (error) => {
        console.error('Error loading supplier:', error);
      }
    );
  }


  openStockSelector() {
    this.dialogService.open(SelectStockModalComponent, {
      context: {
        salelist: this.salelist,
        isSale: false,
        isSelectedShop: this.shopId ? true : false,
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
    const shopId = this.shopId;
    this.stockService.getStocksByStatus("PURCHASE", +shopId).subscribe(
      (data) => {
        this.salelist = data;
        this.salelist['isSale'] = true;
      },
      (error) => {
        console.error('Error loading purchase:', error);
      }
    );
  }
  onClientChange(id: string) {
    const client = this.supplier.find(c => c.id === +id);
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

  goBack() {
    this.router.navigate(['/pages/pos/view-purchase']);
    this.resetForm();
  }

  resetForm() {
    this.shopId = null;
    this.supplierId = null;
    this.address = '';
    this.supplierInvoiceNo = '';
    this.purchaseDate = null;
    this.cashReceived = null;
    this.paymentMode = '';

    this.isViewMode = false;
    this.selectedProduct = [];
  }


  submitSale() {
    const shopId = this.shopId;
    const supplierId = this.supplierId;


    // Validate required fields
    if (!shopId) {
      this.toasterService.showError('Please select a selling shop.');
      return;
    }

    if (!this.selectedProduct || this.selectedProduct.length === 0) {
      this.toasterService.showError('Please select at least one product.');
      return;
    }

    const localDateTime = this.purchaseDate; // e.g. "2025-05-27T08:08"
    const utcDateTime = new Date(localDateTime).toISOString();

    const payload = {
      shopId: +shopId,
      supplierId: +supplierId,
      supplierInvoiceNo: this.supplierInvoiceNo,
      status: 'ACTIVE',
      saleDate: utcDateTime,
      // paymentMode: this.paymentMode,
      paidAmount: this.paymentMode === 'Cash' ? this.cashReceived : null,
      // bankName: this.paymentMode === 'Bank' ? this.bankName : null,
      // bankTransactionId: this.paymentMode === 'Bank' ? this.bankTransactionId : null,
      // dueDate: this.paymentMode === 'Credit' ? this.dueDate : null,
      items: this.selectedProduct?.map(item => ({
        productId: item.product?.id,
        quantity: item.quantity,
        unitPrice: item.retailPrice,
        soldPrice: item.sellingPrice,
        discount: item.discount,
        totalPrice: this.getLineTotal(item),
        tax: 0
      })),
      // bulkDiscount: this.bulkDiscount || 0,
      discountPercentage: this.vatRate || 0,
      totalBeforeVat: this.totalWithoutVat || 0,
      totalAmount: this.total || 0,
      vatAmount: this.totalVatTax //confirm
    };


    // Now send to backend
    this.purchaseService.addPurchase(payload).subscribe({
      next: (res) => {
        this.toasterService.showSuccess('Purchase created successfully!');
      },
      error: (err) => {
        this.toasterService.showError('Failed to create purchase.');
      }
    });
  }

}