import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertCityComponent } from './upsert-city.component';

describe('UpsertCityComponent', () => {
  let component: UpsertCityComponent;
  let fixture: ComponentFixture<UpsertCityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertCityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpsertCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
