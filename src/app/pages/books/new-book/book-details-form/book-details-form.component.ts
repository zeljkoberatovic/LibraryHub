import { Component, inject, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthorService } from '../../../../services/author/author.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-details-form',
  standalone: true,
  templateUrl: './book-details-form.component.html',
  styleUrls: ['./book-details-form.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class BookDetailsFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authorService = inject(AuthorService);

  @Output() detailsSubmitted = new EventEmitter<any>();

  bookForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    number_of_copies: [1, [Validators.required, Validators.min(1)]],
    language: ['', Validators.required],
    authors: [[] as number[], Validators.required],
    publish_year: [new Date().getFullYear(), [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]]
  });

  authors: any[] = [];
  currentYear = new Date().getFullYear();
  selectedAuthorIds: number[] = [];

  ngOnInit() {
    this.loadAuthors();
  }

  loadAuthors() {
    this.authorService.getAuthors().subscribe({
      next: (authors) => {
        this.authors = authors;
        console.log('Učitani autori:', this.authors);
      },
      error: (error) => {
        console.error('Greška pri učitavanju autora', error);
      }
    });
  }

  onAuthorChange(event: any) {
    const selectedOptions = event.target.selectedOptions;
    this.selectedAuthorIds = Array.from(selectedOptions).map((option: any) => parseInt(option.value));
    this.bookForm.patchValue({ authors: this.selectedAuthorIds });
  }

  onSubmit() {
    if (this.bookForm.valid) {
      this.detailsSubmitted.emit(this.bookForm.value);
    } else {
      this.bookForm.markAllAsTouched();
      alert('Molimo popunite sva obavezna polja u detaljima knjige');
    }
  }
}