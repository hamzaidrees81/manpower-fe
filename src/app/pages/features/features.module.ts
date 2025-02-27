import { NgModule } from '@angular/core';
import { NbCardModule, NbIconModule, NbInputModule, NbTabsetModule, NbTreeGridModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { FeaturesRoutingModule, routedComponents } from './features-routing.module';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { FormsModule } from '@angular/forms';

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
    FormsModule
  ],
  declarations: [
    ...routedComponents,
    TimesheetComponent,
  ],
})
export class FeaturesModule { }
