import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentListDialogComponent } from './component-list-dialog.component';

describe('ComponentListDialogComponent', () => {
  let component: ComponentListDialogComponent;
  let fixture: ComponentFixture<ComponentListDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentListDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
