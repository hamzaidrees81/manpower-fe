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



const SERVICES = [
  CompanyService,
  UserService,
  ProjectService,
  DatePickerService,
  SponsorService,
  AssetService,
  DesignationService,
  TimesheetService,
  InvoiceService
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
