import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSaleComponent } from './add-sale/add-sale.component';
import { AddInventoryComponent } from './add-inventory/add-inventory.component';
import { BrandComponent } from './brand/brand.component';
import { ProductComponent } from './product/product.component';
import { CategoryComponent } from './category/category.component';
import { StockComponent } from './stock/stock.component';
import { SupplierComponent } from './supplier/supplier.component';
import { ShopComponent } from './shop/shop.component';
import { ViewSaleComponent } from './view-sale/view-sale.component';
import { PrintSaleInvoiceComponent } from './print-sale-invoice/print-sale-invoice.component';
import { ViewPurchaseComponent } from './view-purchase/view-purchase.component';

const routes: Routes = [
  { path: 'add-sale', component: AddSaleComponent },
  { path: 'view-sale', component: ViewSaleComponent },
   { path: 'print-sale-invoice', component: PrintSaleInvoiceComponent },
  { path: 'add-purchase', component: AddInventoryComponent },
   { path: 'view-purchase', component: ViewPurchaseComponent },
  { path: 'brand', component: BrandComponent },
  { path: 'product', component: ProductComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'stock', component: StockComponent },
  { path: 'supplier', component: SupplierComponent },
  { path: 'shop', component: ShopComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosRoutingModule { }
