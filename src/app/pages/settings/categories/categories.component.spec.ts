import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryComponents } from './categories.component';

describe('CategoryComponents', () => {
  let component: CategoryComponents;
  let fixture: ComponentFixture<CategoryComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
