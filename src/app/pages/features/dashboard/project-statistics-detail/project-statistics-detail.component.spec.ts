import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStatisticsDetailComponent } from './project-statistics-detail.component';

describe('ProjectStatisticsDetailComponent', () => {
  let component: ProjectStatisticsDetailComponent;
  let fixture: ComponentFixture<ProjectStatisticsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectStatisticsDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectStatisticsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
