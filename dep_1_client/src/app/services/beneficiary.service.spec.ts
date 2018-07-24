import { TestBed, inject } from '@angular/core/testing';

import { BeneficiaryService } from './beneficiary.service';

describe('BeneficiaryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BeneficiaryService]
    });
  });

  it('should be created', inject([BeneficiaryService], (service: BeneficiaryService) => {
    expect(service).toBeTruthy();
  }));
});
