import { TestBed } from '@angular/core/testing';

import { CurrencieServiceService } from './currencie-service.service';

describe('CurrencieServiceService', () => {
  let service: CurrencieServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrencieServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
