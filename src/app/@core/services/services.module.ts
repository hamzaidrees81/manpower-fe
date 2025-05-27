import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyService } from './company.service';
import { UserService } from './user.service';
import { ProjectService } from './projects.service';
import { DatePickerService } from './date-picker.service';
import { SponsorService } from './sponsor.service';
import { AssetService } from './asset.service';
import { DesignationService } from './designation.service';
import { TimesheetService } from './timesheet.service';
import { InvoiceService } from './invoice.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth-interceptor.service';
import { ExpenseService } from './expense.service';
import { AccountsService } from './accounts.service';
import { AddSaleService } from './pos-services/add-sale.service';
import { ProductService } from './pos-services/product.service';
import { BrandService } from './pos-services/brand.service';
import { CategoryService } from './pos-services/category.service';
import { StockService } from './pos-services/stock.service';
import { InventoryService } from './pos-services/inventory.service';
import { SupplierService } from './pos-services/supplier.service';
import { DashboardService } from './dashboard.service';
import { AddPurchaseService } from './pos-services/add-purchase.service';



const SERVICES = [
  // ERP SERVICES
  CompanyService,
  UserService,
  ProjectService,
  DatePickerService,
  SponsorService,
  AssetService,
  DesignationService,
  TimesheetService,
  InvoiceService,
  ExpenseService,
  AccountsService,
  DashboardService,

  // POS SERVICES
  AddSaleService,
  StockService,
  ProductService,
  CategoryService,
  BrandService,
  InventoryService,
  SupplierService,
  AddPurchaseService
];

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    ...SERVICES,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class ServicesModule {
  static forRoot(): ModuleWithProviders<ServicesModule> {
    return {
      ngModule: ServicesModule,
      providers: [
        ...SERVICES,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
      ],
    };
  }
}
