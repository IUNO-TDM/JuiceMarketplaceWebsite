import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientConfigurationsComponent } from './client-configurations.component';

describe('ClientConfigurationsComponent', () => {
  let component: ClientConfigurationsComponent;
  let fixture: ComponentFixture<ClientConfigurationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientConfigurationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
