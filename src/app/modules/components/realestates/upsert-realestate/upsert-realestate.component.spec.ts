import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertRealestateComponent } from './upsert-realestate.component';

describe('UpsertRealestateComponent', () => {
  let component: UpsertRealestateComponent;
  let fixture: ComponentFixture<UpsertRealestateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertRealestateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpsertRealestateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
