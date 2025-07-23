import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLibrarian } from './new-librarian';

describe('NewLibrarian', () => {
  let component: NewLibrarian;
  let fixture: ComponentFixture<NewLibrarian>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewLibrarian]
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
