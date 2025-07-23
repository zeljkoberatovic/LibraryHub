import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrarianProfile } from './librarian-profile';

describe('LibrarianProfile', () => {
  let component: LibrarianProfile;
  let fixture: ComponentFixture<LibrarianProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LibrarianProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibrarianProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
