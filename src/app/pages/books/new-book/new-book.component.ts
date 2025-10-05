import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { BookService } from '../../../services/book/book.service';
import { AuthorService } from '../../../services/author/author.service';
import { CategoryService } from '../../../services/settings/category/category.service';
import { GenreService } from '../../../services/settings/genre/genre.service';
import { PublisherService } from '../../../services/settings/publisher/publisher.service';

import { Book, Author, Category, Genre, Publisher } from '../../../models/book.model';

import { BookDetailsFormComponent } from './book-details-form/book-details-form.component';
import { BookSpecFormComponent } from './book-spec-form/book-spec-form.component';
import { BookMediaFormComponent } from './book-media-form/book-media-form.component';
import { CreateBookDto } from '../../../models/book.model';

@Component({
  selector: 'app-new-book',
  standalone: true,
  templateUrl: './new-book.component.html',
  styleUrls: ['./new-book.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BookDetailsFormComponent,
    BookSpecFormComponent,
    BookMediaFormComponent,
    RouterModule
  ]
})
export class NewBookComponent implements OnInit {
  private bookService = inject(BookService);
  private authorService = inject(AuthorService);
  private categoryService = inject(CategoryService);
  private genreService = inject(GenreService);
  private publisherService = inject(PublisherService);
  private router = inject(Router);

  activeTab = 'details';
  detailsCompleted = false;
  specCompleted = false;
  mediaCompleted = false;

  bookData: Partial<Book> = {}; 

  authorsList: Author[] = [];
  categoriesList: Category[] = [];
  genresList: Genre[] = [];
  publishersList: Publisher[] = [];


  ngOnInit() {
    this.loadLists();
  }

  private loadLists() {
    this.authorService.getAuthors().subscribe(a => this.authorsList = a);
    this.categoryService.getCategories().subscribe(res => this.categoriesList = res.data?.data || []);
    this.genreService.getGenres().subscribe(res => this.genresList = res.data?.data || []);
    this.publisherService.getPublishers().subscribe(res => this.publishersList = res.data?.data || []);
  }

  // Handlers za formu

  onDetailsSubmit(details: any) {
    console.log('Details submitted:', details);
    this.bookData = {
      ...this.bookData,
      ...details,
      authors: this.authorsList.filter(a => details.authors.includes(a.id)),
      categories: this.categoriesList.filter(c => details.categories.includes(c.id)),
      genres: this.genresList.filter(g => details.genres.includes(g.id)),
      publishers: this.publishersList.filter(p => details.publishers.includes(p.id))
    };
    this.detailsCompleted = true;
    this.activeTab = 'specification';
  }

  onSpecSubmit(spec: any) {
    console.log('Spec submitted:', spec);
    this.bookData = {
      ...this.bookData,
      ...spec
    };
    this.specCompleted = true;
    this.activeTab = 'media';
  }

  onMediaSubmit(media: any) {
    console.log('Media submitted:', media);
    this.bookData = {
      ...this.bookData,
      ...media
    };
    this.mediaCompleted = true;
  }

  // Krajna validacija i slanje

  submitBook() {
    if (!this.detailsCompleted || !this.specCompleted) {
      return alert('Popunite sve prethodne forme pre slanja.');
    }

    console.log('Book Data before sending:', this.bookData);

    // Kreiranje DTO-a
   const dto: CreateBookDto = {
  name: this.bookData.name || '',
  description: this.bookData.description || '',
  number_of_pages: Number(this.bookData.number_of_pages) || 0,
  number_of_copies: Number(this.bookData.number_of_copies) || 0,
  isbn: this.bookData.isbn || '',
  language: this.bookData.language || '',
  script: this.bookData.script || '',
  binding: this.bookData.binding || '',
  dimensions: this.bookData.dimensions || '',
  authors: (this.bookData.authors || []).map(a => a.id),      
  categories: (this.bookData.categories || []).map(c => c.id),
  genres: (this.bookData.genres || []).map(g => g.id),
  publishers: (this.bookData.publishers || []).map(p => p.id)

};

    console.log('DTO being sent to API:', dto);

    // Validacija obaveznih polja
    const requiredFields = ['name', 'number_of_pages', 'number_of_copies', 'isbn', 'language', 'script', 'binding', 'dimensions'];
    const missingFields = requiredFields.filter(field => !dto[field as keyof CreateBookDto]);
    if (missingFields.length > 0) {
      return alert(`Popunite obavezna polja: ${missingFields.join(', ')}`);
    }

    if (dto.authors.length === 0) return alert('Odaberite bar jednog autora');
    if (dto.categories.length === 0) return alert('Odaberite bar jednu kategoriju');
    if (dto.genres.length === 0) return alert('Odaberite bar jedan žanr');
    if (dto.publishers.length === 0) return alert('Odaberite bar jednog izdavača');


    // Slanje na API
    this.bookService.createBook(dto).subscribe({
      next: (res) => {
        console.log('Book created successfully:', res);
        alert('Knjiga je uspešno kreirana!');
        this.router.navigate(['/books']);
      },
      error: (err) => {
        console.error('Full error:', err);
        if (err.status === 422) {
          const validationErrors = err.error?.errors || err.error?.data?.errors;
          if (validationErrors) {
            let errorMessage = 'Greška validacije:\n';
            Object.keys(validationErrors).forEach(key => {
              errorMessage += `${key}: ${validationErrors[key].join(', ')}\n`;
            });
            alert(errorMessage);
          } else {
            alert('Došlo je do greške pri validaciji podataka.');
          }
        } else {
          alert('Greška: ' + (err.message || 'Došlo je do greške pri kreiranju knjige.'));
        }
      }
    });
  }
}
