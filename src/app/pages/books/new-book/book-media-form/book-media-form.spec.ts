import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookMediaForm } from './book-media-form';

describe('BookMediaForm', () => {
  let component: BookMediaForm;
  let fixture: ComponentFixture<BookMediaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookMediaForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookMediaForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
