import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BookService } from '../../../../services/book/book.service';
import { Router } from '@angular/router';
import { Book } from '../../../../models/book.model';

@Component({
  selector: 'app-book-details-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-details-form.component.html',
})
export class BookDetailsFormComponent {
  private fb = inject(FormBuilder);
  private bookService = inject(BookService);
  private router = inject(Router);

  detailsForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    number_of_pages: [0, Validators.required],
    number_of_copies: [1, Validators.required],
    isbn: ['', Validators.required],
    language: ['', Validators.required],
    authors: ['']
  });

  onSubmit() {
    if (this.detailsForm.valid) {
      // Parsiranje i logika za osnovne detalje
      console.log(this.detailsForm.value);
      // Možeš poslati podatke u BookService ako želiš
    }
  }
}
