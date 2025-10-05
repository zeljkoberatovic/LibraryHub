// book-spec-form.component.ts
import { Component, EventEmitter, Output, inject } from '@angular/core';
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

  scripts = [
    { id: 'Latin', name: 'Latinica' },
    { id: 'Cyrillic', name: 'Ćirilica' },
    { id: 'Arabic', name: 'Arapsko pismo' },
    { id: 'Chinese', name: 'Kinesko pismo' },
    { id: 'Japanese', name: 'Japansko pismo' }
  ];

  bindings = [
    { id: 'Hardcover', name: 'Tvrdi povez' },
    { id: 'Paperback', name: 'Meki povez' },
    { id: 'Spiral', name: 'Spiralni povez' },
    { id: 'SaddleStitch', name: 'Spajalica' },
    { id: 'CaseBound', name: 'Bibliotekarski povez' }
  ];

  bookForm = this.fb.group({
    number_of_pages: [null, [Validators.required, Validators.min(1), Validators.max(5000)]],
    script: ['', Validators.required],
    binding: ['', Validators.required],
    isbn: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(97(8|9))?\d{9}(\d|X)$/)
      ]
    ]
  });

  onSubmit() {
    if (this.bookForm.valid) {
      this.specSubmitted.emit(this.bookForm.value);
    } else {
      this.bookForm.markAllAsTouched();
      alert('Molimo popunite sva obavezna polja u specifikacijama knjige');
    }
  }
}