import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridDropMenuComponent } from './grid-drop-menu.component';

describe('GridDropMenuComponent', () => {
  let component: GridDropMenuComponent;
  let fixture: ComponentFixture<GridDropMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridDropMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridDropMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
