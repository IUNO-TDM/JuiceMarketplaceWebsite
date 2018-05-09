import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientMapComponent } from './client-map.component';

describe('ClientMapComponent', () => {
  let component: ClientMapComponent;
  let fixture: ComponentFixture<ClientMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
