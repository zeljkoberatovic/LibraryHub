import { Component, OnInit, inject } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookService } from '../../../services/book/book.service';
import { Book, CreateBookDto } from '../../../models/book.model';
import { AuthorService } from '../../../services/author/author.service';
import { CategoryService } from '../../../services/settings/category/category.service';
import { GenreService } from '../../../services/settings/genre/genre.service';
import { PublisherService } from '../../../services/settings/publisher/publisher.service';

@Component({
  selector: 'app-edit-book',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBook implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookService = inject(BookService);
  private fb = inject(FormBuilder);

  private authorService = inject(AuthorService);
  private categoryService = inject(CategoryService);
  private genreService = inject(GenreService);
  private publisherService = inject(PublisherService);

  bookId!: number;
  book!: Book;
  isLoading = true;
  isSubmitting = false;

 

  // Dropdown liste
  authorsList: { id: number; first_name: string; last_name: string }[] = [];
  categoriesList: { id: number; name: string }[] = [];
  genresList: { id: number; name: string }[] = [];
  publishersList: { id: number; name: string }[] = [];

  // Reactive forma
  bookForm = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    number_of_pages: [0, [Validators.required]],
    number_of_copies: [0, [Validators.required]],
    isbn: ['', Validators.required],
    language: ['', Validators.required],
    script: ['', Validators.required],
    binding: ['', Validators.required],
    dimensions: ['', Validators.required],
    authors: [[] as number[]],
    categories: [[] as number[]],
    genres: [[] as number[]],
    publishers: [[] as number[]]
  });

  ngOnInit() {
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadSelectData();
    this.loadBookData();
  }

  /** Učitava opcije za dropdown menije */
  private loadSelectData() {
    this.authorService.getAuthors().subscribe({
      next: (res) => (this.authorsList = res),
      error: (err) => console.error('Greška pri učitavanju autora:', err)
    });

    this.categoryService.getCategories().subscribe({
      next: (res) => (this.categoriesList = res.data?.data || res),
      error: (err) => console.error('Greška pri učitavanju kategorija:', err)
    });

    this.genreService.getGenres().subscribe({
      next: (res) => (this.genresList = res.data?.data || res),
      error: (err) => console.error('Greška pri učitavanju žanrova:', err)
    });

    this.publisherService.getPublishers().subscribe({
      next: (res) => (this.publishersList = res.data?.data || res),
      error: (err) => console.error('Greška pri učitavanju izdavača:', err)
    });
  }

  /** Učitava podatke o knjizi i popunjava formu */
  private loadBookData() {
    this.bookService.getBook(this.bookId).subscribe({
      next: (book) => {
        this.book = book;
        this.populateForm(book);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Greška:', err);
        alert('Greška pri učitavanju knjige');
        this.router.navigate(['/books']);
      }
    });
  }

  private populateForm(book: Book) {
    this.bookForm.patchValue({
      name: book.name,
      description: book.description || '',
      number_of_pages: book.number_of_pages,
      number_of_copies: book.number_of_copies,
      isbn: book.isbn,
      language: book.language,
      script: book.script,
      binding: book.binding,
      dimensions: book.dimensions,
      authors: book.authors?.map(a => a.id) || [],
      categories: book.categories?.map(c => c.id) || [],
      genres: book.genres?.map(g => g.id) || [],
      publishers: book.publishers?.map(p => p.id) || []
    });
  }

  /** Ažurira knjigu */
  onSubmit() {
    if (this.bookForm.invalid) {
      alert('Popunite sva obavezna polja.');
      return;
    }

    this.isSubmitting = true;
    const formData = this.bookForm.value;

    const updateData: CreateBookDto = {
      name: formData.name!,
      description: formData.description || '',
      number_of_pages: Number(formData.number_of_pages),
      number_of_copies: Number(formData.number_of_copies),
      isbn: formData.isbn!,
      language: formData.language!,
      script: formData.script!,
      binding: formData.binding!,
      dimensions: formData.dimensions!,
      authors: formData.authors || [],
      categories: formData.categories || [],
      genres: formData.genres || [],
      publishers: formData.publishers || []
    };

    this.bookService.updateBook(this.bookId, updateData).subscribe({
      next: () => {
        alert('Knjiga uspešno ažurirana!');
        this.router.navigate(['/books']);
      },
      error: (err) => {
        console.error('Greška pri ažuriranju:', err);
        alert('Greška pri ažuriranju knjige');
        this.isSubmitting = false;
      }
    });
  }

  onCancel() {
    this.router.navigate(['/books']);
  }
}
