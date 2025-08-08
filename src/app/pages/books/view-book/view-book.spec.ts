import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBook } from './view-book.component';

describe('ViewBook', () => {
  let component: ViewBook;
  let fixture: ComponentFixture<ViewBook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewBook]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewBook);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
