import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetStatisticsDetailComponent } from './asset-statistics-detail.component';

describe('AssetStatisticsDetailComponent', () => {
  let component: AssetStatisticsDetailComponent;
  let fixture: ComponentFixture<AssetStatisticsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetStatisticsDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetStatisticsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
