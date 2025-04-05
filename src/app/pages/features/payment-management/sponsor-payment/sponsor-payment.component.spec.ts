import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorPaymentComponent } from './sponsor-payment.component';

describe('SponsorPaymentComponent', () => {
  let component: SponsorPaymentComponent;
  let fixture: ComponentFixture<SponsorPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SponsorPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SponsorPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
