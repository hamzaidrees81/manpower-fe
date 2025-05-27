import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSaleInvoiceComponent } from './print-sale-invoice.component';

describe('PrintSaleInvoiceComponent', () => {
  let component: PrintSaleInvoiceComponent;
  let fixture: ComponentFixture<PrintSaleInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintSaleInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintSaleInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
