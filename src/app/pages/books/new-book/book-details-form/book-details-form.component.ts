import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-details-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './book-details-form.component.html',
})
export class BookDetailsFormComponent {
  private fb = inject(FormBuilder);

  @Input() authorsList: any[] = [];
  @Input() categoriesList: any[] = [];
  @Input() genresList: any[] = [];
  @Input() publishersList: any[] = [];

  @Output() detailsSubmitted = new EventEmitter<any>();

  // Selektovani ID-jevi
  selectedAuthors: number[] = [];
  selectedCategories: number[] = [];
  selectedGenres: number[] = [];
  selectedPublishers: number[] = [];

  // Dropdown state
  showAuthors = false;
  showCategories = false;
  showGenres = false;
  showPublishers = false;

  languages = [
    { id: 'Serbian', name: 'Srpski' },
    { id: 'English', name: 'Engleski' },
    { id: 'French', name: 'Francuski' },
    { id: 'German', name: 'Nemački' },
    { id: 'Spanish', name: 'Španski' },
    { id: 'Italian', name: 'Italijanski' },
    { id: 'Russian', name: 'Ruski' }
  ];

  // Samo osnovna polja u formi
  bookForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    number_of_copies: [null, [Validators.required, Validators.min(1)]],
    language: ['', Validators.required],
    dimensions: ['', Validators.required],
  });

  // Toggle funkcije
  toggleAuthor(id: number) { this.toggleItem(this.selectedAuthors, id); }
  toggleCategory(id: number) { this.toggleItem(this.selectedCategories, id); }
  toggleGenre(id: number) { this.toggleItem(this.selectedGenres, id); }
  togglePublisher(id: number) { this.toggleItem(this.selectedPublishers, id); }

  private toggleItem(list: number[], id: number) {
    const i = list.indexOf(id);
    if (i > -1) list.splice(i, 1);
    else list.push(id);
  }

  isAuthorSelected(id: number) { return this.selectedAuthors.includes(id); }
  isCategorySelected(id: number) { return this.selectedCategories.includes(id); }
  isGenreSelected(id: number) { return this.selectedGenres.includes(id); }
  isPublisherSelected(id: number) { return this.selectedPublishers.includes(id); }

  getAuthorName(id: number) {
    const a = this.authorsList.find(x => x.id === id);
    return a ? `${a.first_name} ${a.last_name}` : '';
  }
  getCategoryName(id: number) {
    const c = this.categoriesList.find(x => x.id === id);
    return c ? c.name : '';
  }
  getGenreName(id: number) {
    const g = this.genresList.find(x => x.id === id);
    return g ? g.name : '';
  }
  getPublisherName(id: number) {
    const p = this.publishersList.find(x => x.id === id);
    return p ? p.name : '';
  }

 onSubmit() {
  this.bookForm.markAllAsTouched();

  if (this.bookForm.valid &&
      this.selectedAuthors.length &&
      this.selectedCategories.length &&
      this.selectedGenres.length &&
      this.selectedPublishers.length) {

    
    this.detailsSubmitted.emit({
      name: this.bookForm.value.name,
      description: this.bookForm.value.description,
      number_of_copies: this.bookForm.value.number_of_copies,
      language: this.bookForm.value.language,
      dimensions: this.bookForm.value.dimensions,
      authors: this.selectedAuthors,
      categories: this.selectedCategories,
      genres: this.selectedGenres,
      publishers: this.selectedPublishers

    });

  } else {
    alert('Popunite sva obavezna polja i odaberite najmanje po jednu stavku iz svih lista.');
  }
}

}
