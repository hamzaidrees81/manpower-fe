import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../../@core/services/pos-services/shop.service';
import { Router } from '@angular/router';
import { SupplierService } from '../../../@core/services/pos-services/supplier.service';
import { AddPurchaseService } from '../../../@core/services/pos-services/add-purchase.service';

@Component({
  selector: 'ngx-view-purchase',
  templateUrl: './view-purchase.component.html',
  styleUrls: ['./view-purchase.component.scss']
})
export class ViewPurchaseComponent implements OnInit {
  shops: any[] = [];
  supplier: any[] = [];
  purchase: any[] = [];


  supplierId;
  shopId;
  status: 'ACTIVE';
  dateFrom;
  dateTo;


  constructor(
    private purchaseService: AddPurchaseService,
    private shopService: ShopService,
    private supplierService: SupplierService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadSupplier();
    this.loadShops();
    this.loadPurchase();
  }

  loadShops(): void {
    this.shopService.getShops().subscribe({
      next: (data) => this.shops = data,
      error: (err) => console.error('Error loading shops', err)
    });
  }

  editPurchase(purchase) {
    this.router.navigate(['/pages/pos/add-purchase'], {
      queryParams: { id: purchase.id, mode: 'edit' }
    });
  }

  viewPurchase(purchase) {
    this.router.navigate(['/pages/pos/add-purchase'], {
      queryParams: { id: purchase.id, mode: 'view' }
    });
  }

  printPurchase(purchase) {
    this.router.navigate(['/pages/pos/print-purchase-invoice'], {
      queryParams: { id: purchase.id, mode: 'print' }
    });
  }

  loadSupplier(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (data) => this.supplier = data,
      error: (err) => console.error('Error loading supplier', err)
    });
  }

  loadPurchase(): void {
    this.purchaseService.getFilteredPurchase(
      this.supplierId,
      this.shopId,
      this.status,
      this.dateFrom,
      this.dateTo
    ).subscribe({
      next: (data) => {
        this.purchase = data;
      },
      error: (err) => {
        console.error('Error loading purchase', err);
      }
    });
  }


}
