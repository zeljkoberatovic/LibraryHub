import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { BookService } from '../../../services/book/book.service';
import { AuthorService } from '../../../services/author/author.service';
import { CategoryService } from '../../../services/settings/category/category.service';
import { GenreService } from '../../../services/settings/genre/genre.service';
import { PublisherService } from '../../../services/settings/publisher/publisher.service';

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
    BookMediaFormComponent
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

  bookData: any = {};

  authorsList: any[] = [];
  categoriesList: any[] = [];
  genresList: any[] = [];
  publishersList: any[] = [];

  isLoading = true;

  ngOnInit() {
    this.loadLists();
  }

  private loadLists() {
    this.authorService.getAuthors().subscribe(a => this.authorsList = a);

    this.categoryService.getCategories().subscribe(res => {
      this.categoriesList = res.data?.data || [];
    });

    this.genreService.getGenres().subscribe(res => {
      this.genresList = res.data?.data || [];
    });

    this.publisherService.getPublishers().subscribe(res => {
      this.publishersList = res.data?.data || [];
    });
  }

  onDetailsSubmit(details: any) {
    console.log('Details submitted:', details);
    this.bookData = { ...this.bookData, ...details };
    this.detailsCompleted = true;
    this.activeTab = 'specification';
  }

  onSpecSubmit(spec: any) {
    console.log('Spec submitted:', spec);
    this.bookData = { ...this.bookData, ...spec };
    this.specCompleted = true;
    this.activeTab = 'media';
  }

  onMediaSubmit(media: any) {
    this.bookData = { ...this.bookData, ...media };
    this.mediaCompleted = true;
  }

  submitBook() {
  if (!this.detailsCompleted) {
    return alert('Popunite osnovne podatke');
  }

  console.log('Book Data before sending:', this.bookData);

  // Priprema podataka za API - BEZ SLIKA
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
    author_ids: Array.isArray(this.bookData.authors) ? this.bookData.authors : [],
    category_ids: Array.isArray(this.bookData.categories) ? this.bookData.categories : [],
    genre_ids: Array.isArray(this.bookData.genres) ? this.bookData.genres : [],
    publisher_ids: Array.isArray(this.bookData.publishers) ? this.bookData.publishers : []
  };

  console.log('DTO being sent to API:', dto);

  // Provera obaveznih polja pre slanja
  const requiredFields = [
    'name', 'number_of_pages', 'number_of_copies', 'isbn', 
    'language', 'script', 'binding', 'dimensions'
  ];

  const missingFields = requiredFields.filter(field => !dto[field as keyof CreateBookDto]);
  if (missingFields.length > 0) {
    alert(`Popunite obavezna polja: ${missingFields.join(', ')}`);
    return;
  }

  // Provera da li su nizovi popunjeni
  if (dto.author_ids.length === 0) {
    alert('Odaberite bar jednog autora');
    return;
  }
  if (dto.category_ids.length === 0) {
    alert('Odaberite bar jednu kategoriju');
    return;
  }
  if (dto.genre_ids.length === 0) {
    alert('Odaberite bar jedan žanr');
    return;
  }
  if (dto.publisher_ids.length === 0) {
    alert('Odaberite bar jednog izdavača');
    return;
  }

  this.bookService.createBook(dto).subscribe({
    next: (response) => {
      console.log('Book created successfully:', response);
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
          alert('Došlo je do greške pri validaciji podataka. Proverite sva polja.');
        }
      } else {
        alert('Greška: ' + (err.message || 'Došlo je do greške prilikom kreiranja knjige'));
      }
    }
  });
}
}