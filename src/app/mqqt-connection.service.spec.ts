import { TestBed } from '@angular/core/testing';

import { MqqtConnectionService } from './mqqt-connection.service';

describe('MqqtConnectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MqqtConnectionService = TestBed.get(MqqtConnectionService);
    expect(service).toBeTruthy();
  });
});
