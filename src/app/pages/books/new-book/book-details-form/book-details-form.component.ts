import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-details-form',
  standalone: true,
  templateUrl: './book-details-form.component.html',
  styleUrls: ['./book-details-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class BookDetailsFormComponent {
  private fb = inject(FormBuilder);

  @Output() detailsSubmitted = new EventEmitter<any>();

  bookForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    number_of_pages: [null, [Validators.required, Validators.min(1)]],
    number_of_copies: [null, [Validators.required, Validators.min(1)]],
    language: ['', Validators.required],
    dimensions: ['', Validators.required],

    // ovi su višestruki izbori (checkbox/select) pa vraćaju niz ID-jeva
    categories: [[], Validators.required],
    genres: [[], Validators.required],
    publishers: [[], Validators.required],
    authors: [[], Validators.required]
  });
authorsList: any;
categoriesList: any;
genresList: any;
publishersList: any;

  onSubmit() {
    if (this.bookForm.valid) {
      this.detailsSubmitted.emit(this.bookForm.value);
    } else {
      this.bookForm.markAllAsTouched();
      alert('Molimo popunite sva obavezna polja u osnovnim detaljima knjige');
    }
  }
}
