import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookSpecForm } from './book-spec-form';

describe('BookSpecForm', () => {
  let component: BookSpecForm;
  let fixture: ComponentFixture<BookSpecForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookSpecForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookSpecForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
