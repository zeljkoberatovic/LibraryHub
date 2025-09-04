import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../../../services/book/book.service';
import { Book } from '../../../models/book.model';

@Component({
  selector: 'app-book-create',
  standalone: true,
  templateUrl: './new-book.component.html',
  styleUrls: ['./new-book.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class BookCreateComponent {
  // ✅ koristimo inject API umesto konstruktora
  private fb = inject(FormBuilder);
  private bookService = inject(BookService);
  private router = inject(Router);

  // ✅ forma se pravi odmah bez greške "before initialization"
  bookForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    number_of_pages: [0, Validators.required],
    number_of_copies: [1, Validators.required],
    isbn: ['', Validators.required],
    language: ['', Validators.required],
    script: [''],
    binding: [''],
    dimensions: [''],
    authors: [''] // unos ID-eva kao string, npr. "1, 2, 3"
  });

  onSubmit() {
    if (this.bookForm.valid) {
      const formValue = this.bookForm.value;

      // parsiranje autora u niz brojeva
      const authors = formValue.authors
        ? (formValue.authors as string)
            .split(',')
            .map(id => parseInt(id.trim(), 10))
        : [];

      const newBook: Book = {
        ...formValue,
        authors
      } as Book;

      this.bookService.createBook(newBook).subscribe(() => {
        this.router.navigate(['/books']);
      });
    }
  }

  onCancel() {
    this.router.navigate(['/books']);
  }
}
