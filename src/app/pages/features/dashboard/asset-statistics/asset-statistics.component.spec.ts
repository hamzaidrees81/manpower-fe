import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetStatisticsComponent } from './asset-statistics.component';

describe('AssetStatisticsComponent', () => {
  let component: AssetStatisticsComponent;
  let fixture: ComponentFixture<AssetStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetStatisticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
