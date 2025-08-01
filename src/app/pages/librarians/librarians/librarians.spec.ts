import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Librarians } from './librarians.component';

describe('Librarians', () => {
  let component: Librarians;
  let fixture: ComponentFixture<Librarians>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Librarians]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Librarians);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
