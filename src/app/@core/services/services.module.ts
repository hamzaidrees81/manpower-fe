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



const SERVICES = [
  CompanyService,
  UserService,
  ProjectService,
  DatePickerService,
  SponsorService,
  AssetService,
  DesignationService,
  TimesheetService
];

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    ...SERVICES,
  ],
})
export class ServicesModule {
  static forRoot(): ModuleWithProviders<ServicesModule> {
    return {
      ngModule: ServicesModule,
      providers: [
        ...SERVICES,
      ],
    };
  }
}
