import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceReceivableComponent } from './invoice-receivable.component';

describe('InvoiceReceivableComponent', () => {
  let component: InvoiceReceivableComponent;
  let fixture: ComponentFixture<InvoiceReceivableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceReceivableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceReceivableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
