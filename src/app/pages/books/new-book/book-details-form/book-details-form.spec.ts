import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDetailsForm } from './book-details-form';

describe('BookDetailsForm', () => {
  let component: BookDetailsForm;
  let fixture: ComponentFixture<BookDetailsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookDetailsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookDetailsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
