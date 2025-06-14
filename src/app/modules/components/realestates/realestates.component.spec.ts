import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealestatesComponent } from './realestates.component';

describe('RealestatesComponent', () => {
  let component: RealestatesComponent;
  let fixture: ComponentFixture<RealestatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealestatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealestatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
