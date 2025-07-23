import { TestBed } from '@angular/core/testing';

import { Librarians } from './librarians';

describe('Librarians', () => {
  let service: Librarians;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Librarians);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
