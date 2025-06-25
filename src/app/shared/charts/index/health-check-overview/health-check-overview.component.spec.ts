import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthCheckOverviewComponent } from './health-check-overview.component';

describe('HealthCheckOverviewComponent', () => {
  let component: HealthCheckOverviewComponent;
  let fixture: ComponentFixture<HealthCheckOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthCheckOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HealthCheckOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
