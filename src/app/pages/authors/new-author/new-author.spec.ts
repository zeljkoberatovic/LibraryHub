import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAuthor } from './new-author';

describe('NewAuthor', () => {
  let component: NewAuthor;
  let fixture: ComponentFixture<NewAuthor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAuthor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAuthor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
