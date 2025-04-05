import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetPaymentComponent } from './asset-payment.component';

describe('AssetPaymentComponent', () => {
  let component: AssetPaymentComponent;
  let fixture: ComponentFixture<AssetPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
