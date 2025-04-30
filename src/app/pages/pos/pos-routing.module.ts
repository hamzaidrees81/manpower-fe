import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSaleComponent } from './add-sale/add-sale.component';
import { AddInventoryComponent } from './add-inventory/add-inventory.component';
import { BrandComponent } from './brand/brand.component';
import { ProductComponent } from './product/product.component';
import { CategoryComponent } from './category/category.component';
import { StockComponent } from './stock/stock.component';
import { SupplierComponent } from './supplier/supplier.component';

const routes: Routes = [
  { path: 'add-sale', component: AddSaleComponent },
  { path: 'add-inventory', component: AddInventoryComponent },
  { path: 'brand', component: BrandComponent },
  { path: 'product', component: ProductComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'stock', component: StockComponent },
  { path: 'supplier', component: SupplierComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosRoutingModule { }
