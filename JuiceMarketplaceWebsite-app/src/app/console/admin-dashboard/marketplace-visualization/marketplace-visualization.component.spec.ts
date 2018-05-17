import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceVisualizationComponent } from './marketplace-visualization.component';

describe('MarketplaceVisualizationComponent', () => {
  let component: MarketplaceVisualizationComponent;
  let fixture: ComponentFixture<MarketplaceVisualizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplaceVisualizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
