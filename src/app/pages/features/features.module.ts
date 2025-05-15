import { NgModule } from '@angular/core';
import { NbAccordionModule, NbButtonModule, NbCardModule, NbDatepickerModule, NbIconModule, NbInputModule, NbSelectModule, NbTabsetModule, NbTreeGridModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { FeaturesRoutingModule } from './features-routing.module';
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
import { SponsorModalComponent } from './sponsor-modal/sponsor-modal.component';
import { ExpenseComponent } from './payment-management/expense/expense.component';
import { AccountsComponent } from './accounts/accounts.component';
import { AssetComponent } from './asset/asset.component';
import { CompanyComponent } from './company/company.component';
import { FeaturesComponent } from './features.component';
import { ProjectsComponent } from './projects/projects.component';
import { UsersComponent } from './users/users.component';
import { LedgerComponent } from './ledger/ledger.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AssetStatisticsComponent } from './dashboard/asset-statistics/asset-statistics.component';
import { ProjectStatisticsComponent } from './dashboard/project-statistics/project-statistics.component';
import { AssetStatisticsDetailComponent } from './dashboard/asset-statistics-detail/asset-statistics-detail.component';
import { ProjectStatisticsDetailComponent } from './dashboard/project-statistics-detail/project-statistics-detail.component';

@NgModule({
  imports: [
    NbCardModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    FeaturesRoutingModule,
    Ng2SmartTableModule,
    NbTabsetModule,
    NbButtonModule ,
    FormsModule,
    NbAccordionModule,
    NbSelectModule,
    NbDatepickerModule, // ✅ Remove .forRoot() (it should only be in AppModule)
  ],
  declarations: [
    FeaturesComponent,
    AssetComponent,
    CompanyComponent,
    ProjectsComponent,
    UsersComponent,
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
    SponsorModalComponent,
    ExpenseComponent,
    AccountsComponent,
    LedgerComponent,
    DashboardComponent,
    AssetStatisticsComponent,
    ProjectStatisticsComponent,
    AssetStatisticsDetailComponent,
    ProjectStatisticsDetailComponent, 
  ],
  exports: [CustomDatepickerComponent], // Export it if used in other modules
})
export class FeaturesModule { }
