import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookService } from '../../../services/book/book.service';
import { BookDetailsFormComponent } from './book-details-form/book-details-form.component';
import { BookSpecFormComponent } from './book-spec-form/book-spec-form.component';
import { BookMediaFormComponent } from './book-media-form/book-media-form.component';
import { Book, CreateBookDto } from '../../../models/book.model';

@Component({
  selector: 'app-new-book',
  standalone: true,
  templateUrl: './new-book.component.html',
  styleUrls: ['./new-book.component.css'],
  imports: [
    CommonModule,
    BookDetailsFormComponent,
    BookSpecFormComponent,
    BookMediaFormComponent
  ]
})
export class NewBookComponent {
  private bookService = inject(BookService);
  private router = inject(Router);

  // Child references
  @ViewChild(BookDetailsFormComponent) detailsForm!: BookDetailsFormComponent;
  @ViewChild(BookSpecFormComponent) specForm!: BookSpecFormComponent;
  @ViewChild(BookMediaFormComponent) mediaForm!: BookMediaFormComponent;

  bookData: any = {};
  activeTab: string = 'details';

  detailsCompleted = false;
  specCompleted = false;
  mediaCompleted = false;

  // ---------------- Child Events ----------------
  onDetailsSubmit(details: any) {
    this.bookData = { ...this.bookData, ...details };
    this.detailsCompleted = true;
    this.activeTab = 'specification';
  }

  onSpecSubmit(spec: any) {
    this.bookData = { ...this.bookData, ...spec };
    this.specCompleted = true;
    this.activeTab = 'media';
  }

  onMediaSubmit(media: any) {
    this.bookData = { ...this.bookData, ...media };
    this.mediaCompleted = true;
  }

  // ---------------- Submit ----------------
  submitBook() {
    if (!this.detailsCompleted || !this.specCompleted) {
      alert('Molimo popunite sve obavezne podatke u svim formama');
      return;
    }

    const dto: CreateBookDto = {
      name: this.bookData.name,
      description: this.bookData.description,
      number_of_pages: Number(this.bookData.number_of_pages),
      number_of_copies: Number(this.bookData.number_of_copies),
      isbn: this.bookData.isbn,
      language: this.bookData.language,
      script: this.bookData.script,
      binding: this.bookData.binding,
      dimensions: this.bookData.dimensions,
      images: this.bookData.images || [],
      category_ids: this.bookData.categories || [],
      genre_ids: this.bookData.genres || [],
      publisher_ids: this.bookData.publishers || [],
      author_ids: this.bookData.authors || []
    };

    this.bookService.createBook(dto).subscribe({
      next: (createdBook: Book) => {
        alert('Knjiga uspešno kreirana!');
        this.router.navigate(['/books']);
      },
      error: (err) => {
        alert('Greška pri kreiranju knjige: ' + err.message);
      }
    });
  }

  // ---------------- UI Helpers ----------------
  changeTab(tab: string) {
    this.activeTab = tab;
  }

  restartForm() {
    if (confirm('Da li ste sigurni da želite da restartujete formu? Svi podaci će biti izgubljeni.')) {
      this.bookData = {};
      this.detailsCompleted = false;
      this.specCompleted = false;
      this.mediaCompleted = false;
      this.activeTab = 'details';

      if (this.detailsForm) this.detailsForm.bookForm.reset();
      if (this.specForm) this.specForm.bookForm.reset();
      if (this.mediaForm) {
        this.mediaForm.mediaForm.reset();
        this.mediaForm.imagePreview = [];
      }
    }
  }

  onCancel() {
    if (confirm('Da li ste sigurni da želite da otkažete?')) {
      this.router.navigate(['/books']);
    }
  }
}
