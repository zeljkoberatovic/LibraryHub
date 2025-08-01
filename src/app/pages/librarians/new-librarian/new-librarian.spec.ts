import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLibrarian } from './new-librarian.component';

describe('NewLibrarian', () => {
  let component: NewLibrarian;
  let fixture: ComponentFixture<NewLibrarian>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewLibrarian]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewLibrarian);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

// Implementation for beforeEach to match its type and usage
function beforeEach(fn: () => Promise<void> | void) {
  // In Angular testing, beforeEach is provided by Jasmine.
  // This implementation simply calls the passed function.
  // In real tests, you should use the global beforeEach from Jasmine.
  fn();
}
function beforeEach(arg0: () => Promise<void>) {
  throw new Error('Function not implemented.');
}

