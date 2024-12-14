import { TestBed } from '@angular/core/testing';

import { ServicioCuadernosService } from './servicio-cuadernos.service';

describe('ServicioCuadernosService', () => {
  let service: ServicioCuadernosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioCuadernosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
