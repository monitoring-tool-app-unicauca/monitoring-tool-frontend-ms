import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectHealthendpointsComponent } from './project-healthendpoints.component';

describe('ProjectHealthendpointsComponent', () => {
  let component: ProjectHealthendpointsComponent;
  let fixture: ComponentFixture<ProjectHealthendpointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectHealthendpointsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectHealthendpointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
