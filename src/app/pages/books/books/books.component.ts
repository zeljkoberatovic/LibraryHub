import { Component, OnInit, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { BookService } from '../../../services/book/book.service';
import { Book } from '../../../models/book.model';

import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { PaginationService } from '../../../shared/pagination/pagination.service';

import { GenreService } from '../../../shared/services/genre.service';
import { PublisherService } from '../../../shared/services/publisher.service';
import { CategoryService } from '../../../shared/services/category.service';



@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, RouterLink],
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
})
export class Books implements OnInit {
  private bookService = inject(BookService);
  private genreService = inject(GenreService);
  private publisherService = inject(PublisherService);
  private categoryService = inject(CategoryService);
  public router = inject(Router);
  pagination = inject(PaginationService);

  books: Book[] = [];
  loading = true;
  sortDirection: 'asc' | 'desc' = 'asc';

  searchTerm: string = '';
  openMenuIndex: number | null = null;

  genresMap: Record<number, string> = {};
  authorsMap: Record<number, string> = {};
  publishersMap: Record<number, string> = {};
  categoriesMap: Record<number, string> = {};

  ngOnInit(): void {
    this.loadBooks();
    this.loadRelatedData();
  }

  private loadBooks(): void {
    this.bookService.getAllBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.pagination.reset();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  private loadRelatedData(): void {
    this.genreService.list().subscribe((genres) => {
      this.genresMap = this.arrayToMap(genres);
    });

    this.publisherService.list().subscribe((publishers) => {
      this.publishersMap = this.arrayToMap(publishers);
    });

    this.categoryService.list().subscribe((categories) => {
      this.categoriesMap = this.arrayToMap(categories);
    });

   
  }

  private arrayToMap(arr: { id: number; name: string }[]): Record<number, string> {
    return arr.reduce((acc, curr) => {
      acc[curr.id] = curr.name;
      return acc;
    }, {} as Record<number, string>);
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.actions-cell')) {
      this.openMenuIndex = null;
    }
  }

  filterBooks(): Book[] {
    let filtered = this.books;

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter((book) =>
        book.name.toLowerCase().includes(term) ||
        (book.isbn?.toLowerCase().includes(term) ?? false)
      );
    }

    return filtered.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return this.sortDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
  }

  get paged(): Book[] {
    const filtered = this.filterBooks();
    this.pagination.updateTotal(filtered.length);
    return this.pagination.getPageSlice(filtered);
  }

  onPageChange(page: number): void {
    this.pagination.currentPage = page;
  }

  sortByName(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }

  goToNewBook(): void {
    this.router.navigate(['/books/new']);
  }

  toggleMenu(index: number): void {
    this.openMenuIndex = this.openMenuIndex === index ? null : index;
  }

  showDetails(book: Book): void {
    this.router.navigate(['/books/view', book.id]);
    this.openMenuIndex = null;
  }

  editBook(book: Book): void {
    this.router.navigate(['/books/edit', book.id]);
    this.openMenuIndex = null;
  }

  deleteBook(book: Book): void {
    if (book.id !== undefined && confirm(`Da li ste sigurni da želite da izbrišete knjigu "${book.name}"?`)) {
      this.bookService.deleteBook(book.id).subscribe(() => {
        this.books = this.books.filter((b) => b.id !== book.id);
      });
    }
    this.openMenuIndex = null;
  }

  // Dodaj ove metode koje vraćaju imena iz mapa prema ID-jевима:

  getCategoryNames(ids: number[]): string {
    if (!ids || ids.length === 0) return '';
    return ids.map(id => this.categoriesMap[id] || 'Nepoznato').join(', ');
  }

  getGenreNames(ids: number[]): string {
    if (!ids || ids.length === 0) return '';
    return ids.map(id => this.genresMap[id] || 'Nepoznato').join(', ');
  }

  getPublisherNames(ids: number[]): string {
    if (!ids || ids.length === 0) return '';
    return ids.map(id => this.publishersMap[id] || 'Nepoznato').join(', ');
  }

  getAuthorNames(ids: number[]): string {
    if (!ids || ids.length === 0) return '';
    return ids.map(id => this.authorsMap[id] || 'Nepoznato').join(', ');
  }
}
