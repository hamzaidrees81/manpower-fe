/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {
  NbButtonModule,
  NbCardModule,
  NbDatepickerModule,
  NbDialogModule,
  NbIconModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';
import { SmartTableDatepickerRenderComponentComponent } from './shared/smart-table-datepicker-render-component/smart-table-datepicker-render-component.component';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { ServicesModule } from './@core/services/services.module';
import { ButtonViewComponent } from './shared/button-view/button-view.component';
import { AddButtonComponent } from './shared/add-button/add-button.component';
import { FormatTextPipe } from './utils/format-text.pipe';
import { SelectStockModalComponent } from './shared/select-stock-modal/select-stock-modal.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  declarations: [AppComponent, SmartTableDatepickerRenderComponentComponent, ConfirmDialogComponent, ButtonViewComponent, AddButtonComponent, FormatTextPipe, SelectStockModalComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NbIconModule,
    NbButtonModule ,
    NbCardModule,
    Ng2SmartTableModule,
    ServicesModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
