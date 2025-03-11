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

const routes: Routes = [{
  path: '',
  component: FeaturesComponent,
  children: [
    {
      path: 'company',
      component: CompanyComponent,
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
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeaturesRoutingModule { }

export const routedComponents = [
  FeaturesComponent,
  AssetComponent,
  CompanyComponent,
  ProjectsComponent,
  UsersComponent
];
