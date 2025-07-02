import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealestatesFilterComponent } from './realestates-filter.component';

describe('RealestatesFilterComponent', () => {
  let component: RealestatesFilterComponent;
  let fixture: ComponentFixture<RealestatesFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealestatesFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealestatesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
