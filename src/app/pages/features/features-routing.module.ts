import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeaturesComponent } from './features.component';
import { AssetComponent } from './asset/asset.component';
import { CompanyComponent } from './company/company.component';
import { ProjectsComponent } from './projects/projects.component';
import { UsersComponent } from './users/users.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { ClientComponent } from './client/client.component';
import { SponsorComponent } from './sponsor/sponsor.component';
import { DesignationComponent } from './designation/designation.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { PrintInvoiceComponent } from './print-invoice/print-invoice.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { AssetPaymentComponent } from './payment-management/asset-payment/asset-payment.component';
import { InvoiceReceivableComponent } from './payment-management/invoice-receivable/invoice-receivable.component';
import { SponsorPaymentComponent } from './payment-management/sponsor-payment/sponsor-payment.component';
import { ExpenseComponent } from './payment-management/expense/expense.component';
import { AccountsComponent } from './accounts/accounts.component';
import { LedgerComponent } from './ledger/ledger.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AssetStatisticsComponent } from './dashboard/asset-statistics/asset-statistics.component';
import { ProjectStatisticsComponent } from './dashboard/project-statistics/project-statistics.component';
import { AssetStatisticsDetailComponent } from './dashboard/asset-statistics-detail/asset-statistics-detail.component';
import { ProjectStatisticsDetailComponent } from './dashboard/project-statistics-detail/project-statistics-detail.component';

const routes: Routes = [{
  path: '',
  component: FeaturesComponent,
  children: [
    {
      path: 'company',
      component: CompanyComponent,
    },
    {
      path: 'accounts',
      component: AccountsComponent,
    },
    {
      path: 'client',
      component: ClientComponent,
    },
    {
      path: 'sponsor',
      component: SponsorComponent,
    },
    {
      path: 'users',
      component: UsersComponent,
    },
    {
      path: 'designations',
      component: DesignationComponent,
    },
    {
      path: 'projects',
      component: ProjectsComponent,
    },
    {
      path: 'asset',
      component: AssetComponent,
    },
    {
      path: 'timesheet',
      component: TimesheetComponent,
    },
    {
      path: 'invoice',
      component: InvoiceComponent,
    },
    {
      path: 'print-invoice',
      component: PrintInvoiceComponent,
    },
    {
      path: 'invoice-detail',
      component: InvoiceDetailComponent,
    },
    {
      path: 'payment-management/asset-payment',
      component: AssetPaymentComponent,
    },
    {
      path: 'payment-management/invoice-receivable',
      component: InvoiceReceivableComponent,
    },
    {
      path: 'payment-management/sponsor-payment',
      component: SponsorPaymentComponent,
    },
    {
      path: 'payment-management/expense',
      component: ExpenseComponent,
    },
    {
      path: 'ledger',
      component: LedgerComponent,
    },
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: 'asset-statistics',
      component: AssetStatisticsComponent,
    },
    {
      path: 'project-statistics',
      component: ProjectStatisticsComponent,
    },
    {
      path: 'asset-statistics-detail',
      component: AssetStatisticsDetailComponent,
    },
    {
      path: 'project-statistics-detail',
      component: ProjectStatisticsDetailComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeaturesRoutingModule { }
