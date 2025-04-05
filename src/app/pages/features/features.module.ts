import { NgModule } from '@angular/core';
import { NbAccordionModule, NbCardModule, NbDatepickerModule, NbIconModule, NbInputModule, NbSelectModule, NbTabsetModule, NbTreeGridModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { FeaturesRoutingModule, routedComponents } from './features-routing.module';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { FormsModule } from '@angular/forms';
import { ClientComponent } from './client/client.component';
import { CustomDatepickerComponent } from '../../shared/custom-datepicker/custom-datepicker.component';
import { SponsorComponent } from './sponsor/sponsor.component';
import { DesignationComponent } from './designation/designation.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { PrintInvoiceComponent } from './print-invoice/print-invoice.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { AssetPaymentComponent } from './payment-management/asset-payment/asset-payment.component';
import { SponsorPaymentComponent } from './payment-management/sponsor-payment/sponsor-payment.component';
import { InvoiceReceivableComponent } from './payment-management/invoice-receivable/invoice-receivable.component';

@NgModule({
  imports: [
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    FeaturesRoutingModule,
    Ng2SmartTableModule,
    NbTabsetModule,
    FormsModule,
    NbAccordionModule,
    NbSelectModule,
    NbDatepickerModule, // ✅ Remove .forRoot() (it should only be in AppModule)
  ],
  declarations: [
    ...routedComponents,
    TimesheetComponent,
    ClientComponent,
    CustomDatepickerComponent,
    SponsorComponent,
    DesignationComponent,
    InvoiceComponent,
    PrintInvoiceComponent,
    InvoiceDetailComponent,
    AssetPaymentComponent,
    SponsorPaymentComponent,
    InvoiceReceivableComponent,
    
  ],
  exports: [CustomDatepickerComponent], // Export it if used in other modules
})
export class FeaturesModule { }
