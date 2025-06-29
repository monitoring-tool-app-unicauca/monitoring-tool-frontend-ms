import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownsGraphComponent } from './downs-graph.component';

describe('DownsGraphComponent', () => {
  let component: DownsGraphComponent;
  let fixture: ComponentFixture<DownsGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownsGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownsGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
