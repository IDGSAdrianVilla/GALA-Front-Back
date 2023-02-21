import { TestBed } from '@angular/core/testing';

import { FuncionesGenericasService } from './funciones-genericas.service';

describe('FuncionesGenericasService', () => {
  let service: FuncionesGenericasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FuncionesGenericasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
