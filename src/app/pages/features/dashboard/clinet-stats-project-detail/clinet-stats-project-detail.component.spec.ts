import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinetStatsProjectDetailComponent } from './clinet-stats-project-detail.component';

describe('ClinetStatsProjectDetailComponent', () => {
  let component: ClinetStatsProjectDetailComponent;
  let fixture: ComponentFixture<ClinetStatsProjectDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinetStatsProjectDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClinetStatsProjectDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
