import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAuthor } from './view-author';

describe('ViewAuthor', () => {
  let component: ViewAuthor;
  let fixture: ComponentFixture<ViewAuthor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAuthor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAuthor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
