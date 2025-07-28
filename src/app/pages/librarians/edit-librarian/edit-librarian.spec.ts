import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLibrarian } from './edit-librarian';

describe('EditLibrarian', () => {
  let component: EditLibrarian;
  let fixture: ComponentFixture<EditLibrarian>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditLibrarian]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLibrarian);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
