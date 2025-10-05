import { Component, EventEmitter, HostListener, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Author, Category, Genre, Publisher, BookDetailsPayload } from '@/app/models/book.model';

@Component({
  selector: 'app-book-details-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './book-details-form.component.html',
  styleUrls: ['./book-details-form.component.css']
})
export class BookDetailsFormComponent {
  private fb = inject(FormBuilder);

  @Input() authorsList: Author[] = [];
  @Input() categoriesList: Category[] = [];
  @Input() genresList: Genre[] = [];
  @Input() publishersList: Publisher[] = [];

  @Output() detailsSubmitted = new EventEmitter<BookDetailsPayload>();

  // Dropdown states
  showAuthors = false;
  showCategories = false;
  showGenres = false;
  showPublishers = false;

  // Selected items
  selectedAuthors: number[] = [];
  selectedCategories: number[] = [];
  selectedGenres: number[] = [];
  selectedPublishers: number[] = [];

  languages = [
    { id: 'Serbian', name: 'Srpski' },
    { id: 'English', name: 'Engleski' },
    { id: 'French', name: 'Francuski' },
    { id: 'German', name: 'Nemački' },
    { id: 'Spanish', name: 'Španski' },
    { id: 'Italian', name: 'Italijanski' },
    { id: 'Russian', name: 'Ruski' }
  ];

  bookForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    number_of_copies: [1, [Validators.required, Validators.min(1)]],
    language: ['', Validators.required],
    dimensions: ['', Validators.required],
  });

  // Selection methods
  toggleAuthor(id: number) {
    const index = this.selectedAuthors.indexOf(id);
    if (index > -1) {
      this.selectedAuthors.splice(index, 1);
    } else {
      this.selectedAuthors.push(id);
    }
  }

  toggleCategory(id: number) {
    const index = this.selectedCategories.indexOf(id);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(id);
    }
  }

  toggleGenre(id: number) {
    const index = this.selectedGenres.indexOf(id);
    if (index > -1) {
      this.selectedGenres.splice(index, 1);
    } else {
      this.selectedGenres.push(id);
    }
  }

  togglePublisher(id: number) {
    const index = this.selectedPublishers.indexOf(id);
    if (index > -1) {
      this.selectedPublishers.splice(index, 1);
    } else {
      this.selectedPublishers.push(id);
    }
  }

  // Check if item is selected
  isAuthorSelected(id: number): boolean {
    return this.selectedAuthors.includes(id);
  }

  isCategorySelected(id: number): boolean {
    return this.selectedCategories.includes(id);
  }

  isGenreSelected(id: number): boolean {
    return this.selectedGenres.includes(id);
  }

  isPublisherSelected(id: number): boolean {
    return this.selectedPublishers.includes(id);
  }

  // Get names for display
  getAuthorName(id: number): string {
    const author = this.authorsList.find(a => a.id === id);
    return author ? `${author.first_name} ${author.last_name}` : '';
  }

  getCategoryName(id: number): string {
    const category = this.categoriesList.find(c => c.id === id);
    return category ? category.name : '';
  }

  getGenreName(id: number): string {
    const genre = this.genresList.find(g => g.id === id);
    return genre ? genre.name : '';
  }

  getPublisherName(id: number): string {
    const publisher = this.publishersList.find(p => p.id === id);
    return publisher ? publisher.name : '';
  }

  // Close all dropdowns
  closeDropdowns() {
    this.showAuthors = true;
    this.showCategories = false;
    this.showGenres = false;
    this.showPublishers = false;
  }
  

  onSubmit() {
    this.bookForm.markAllAsTouched();
    this.closeDropdowns();

    if (this.bookForm.valid && 
        this.selectedAuthors.length > 0 && 
        this.selectedCategories.length > 0 && 
        this.selectedGenres.length > 0 && 
        this.selectedPublishers.length > 0) {
      
      const payload: BookDetailsPayload = {
        name: this.bookForm.value.name || '',
        description: this.bookForm.value.description || '',
        number_of_copies: Number(this.bookForm.value.number_of_copies) || 0,
        language: this.bookForm.value.language || '',
        dimensions: this.bookForm.value.dimensions || '',
        authors: this.selectedAuthors,
        categories: this.selectedCategories,
        genres: this.selectedGenres,
        publishers: this.selectedPublishers
      };

      this.detailsSubmitted.emit(payload);
    } else {
      alert('Molimo popunite sva obavezna polja i odaberite najmanje po jednu stavku iz svih lista.');
    }
  }
}