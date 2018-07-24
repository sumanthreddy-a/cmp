import { TestBed, inject } from '@angular/core/testing';

import { SyncrequestService } from './syncrequest.service';

describe('SyncrequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SyncrequestService]
    });
  });

  it('should be created', inject([SyncrequestService], (service: SyncrequestService) => {
    expect(service).toBeTruthy();
  }));
});
