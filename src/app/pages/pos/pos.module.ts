import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosRoutingModule } from './pos-routing.module';
import { AddSaleComponent } from './add-sale/add-sale.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbInputModule, NbTabsetModule, NbButtonModule, NbAccordionModule, NbSelectModule, NbDatepickerModule, NbRadioModule, NbAutocompleteModule, NbOptionModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';
import { FeaturesRoutingModule } from '../features/features-routing.module';
import { AddInventoryComponent } from './add-inventory/add-inventory.component';
import { BrandComponent } from './brand/brand.component';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';
import { StockComponent } from './stock/stock.component';
import { SupplierComponent } from './supplier/supplier.component';


@NgModule({
  declarations: [
    AddSaleComponent,
    AddInventoryComponent,
    BrandComponent,
    CategoryComponent,
    ProductComponent,
    StockComponent,
    SupplierComponent
  ],
  imports: [
    CommonModule,
    PosRoutingModule,
    NbCardModule,
    NbRadioModule,
    NbIconModule,
    ReactiveFormsModule,
    NbInputModule,
    ThemeModule,
    FeaturesRoutingModule,
    Ng2SmartTableModule,
    NbTabsetModule,
    NbButtonModule ,
    FormsModule,
    NbOptionModule,
    NbAutocompleteModule,
    NbAccordionModule,
    NbSelectModule,
    NbDatepickerModule, // ✅ Remove .forRoot() (it should only be in AppModule)
  ],
  exports: [],
})
export class PosModule { }
