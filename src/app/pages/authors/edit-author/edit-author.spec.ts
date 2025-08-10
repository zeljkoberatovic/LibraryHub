import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAuthor } from './edit-author';

describe('EditAuthor', () => {
  let component: EditAuthor;
  let fixture: ComponentFixture<EditAuthor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAuthor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAuthor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
