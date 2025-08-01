import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLibrarian } from './view-librarian.component';

describe('ViewLibrarian', () => {
  let component: ViewLibrarian;
  let fixture: ComponentFixture<ViewLibrarian>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewLibrarian]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewLibrarian);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
