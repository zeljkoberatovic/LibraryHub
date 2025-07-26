import { TestBed } from '@angular/core/testing';

import { Librarian } from './librarian';

describe('Librarian', () => {
  let service: Librarian;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Librarian);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
