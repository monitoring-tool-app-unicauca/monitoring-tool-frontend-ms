import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthEndpointLineChartComponent } from './health-endpoint-line-chart.component';

describe('HealthEndpointLineChartComponent', () => {
  let component: HealthEndpointLineChartComponent;
  let fixture: ComponentFixture<HealthEndpointLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HealthEndpointLineChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HealthEndpointLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
