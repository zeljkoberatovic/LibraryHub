
import { Component, inject, Output, EventEmitter } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-book-spec-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './book-spec-form.component.html',
  styleUrls: ['./book-spec-form.component.css']
})
export class BookSpecFormComponent {
  private fb = inject(FormBuilder);

  @Output() specSubmitted = new EventEmitter<any>();
  formats: string[] = ['PDF', 'EPUB', 'MOBI', 'Hardcover', 'Paperback'];

  bookForm = this.fb.group({
    number_of_pages: [null, [Validators.required, Validators.min(1)]],
    script: ['', Validators.required],
    binding: ['', Validators.required],
    isbn: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(97(8|9))?\d{9}(\d|X)|^\d{1,5}-\d{1,7}-\d{1,7}-([\dX])$/)
      ]
    ]
  });

  scripts = [
    { id: 'Latin', name: 'Latinica' },
    { id: 'Cyrillic', name: 'Ćirilica' },
    { id: 'Arabic', name: 'Arapsko' },
  ];

  bindings = [
    { id: 'Hardcover', name: 'Tvrdi povez' },
    { id: 'Paperback', name: 'Meki povez' },
    { id: 'Spiral', name: 'Spiralni' },
  ];

  onSubmit() {
    if (this.bookForm.valid) {
      this.specSubmitted.emit(this.bookForm.value);
    } else {
      this.bookForm.markAllAsTouched();
      alert('Molimo popunite sva obavezna polja u specifikacijama knjige');
    }
  }
}