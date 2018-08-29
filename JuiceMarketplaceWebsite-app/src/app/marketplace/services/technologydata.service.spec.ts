import { TestBed, inject } from '@angular/core/testing';

import { TechnologydataService } from './technologydata.service';

describe('TechnologydataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TechnologydataService]
    });
  });

  it('should be created', inject([TechnologydataService], (service: TechnologydataService) => {
    expect(service).toBeTruthy();
  }));
});
