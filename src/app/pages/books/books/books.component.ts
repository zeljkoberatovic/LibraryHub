import { Component, OnInit, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { BookService } from '@/app/services/book/book.service';
import { RentalService } from '@/app/services/rental/rental.service';
import { Book } from '@/app/models/book.model';

import { PaginationComponent } from '@/app/shared/pagination/pagination.component';
import { PaginationService } from '@/app/shared/pagination/pagination.service';
import { Rental } from '@/app/models/rental.model';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, RouterLink],
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
})
export class Books implements OnInit {
  rentalService = inject(RentalService);
  private bookService = inject(BookService);
  public router = inject(Router);
  pagination = inject(PaginationService);

  books: Book[] = [];
  loading = true;
  sortDirection: 'asc' | 'desc' = 'asc';

  searchTerm: string = '';
  openMenuIndex: number | null = null;

  ngOnInit(): void {
    this.loadBooks();
  }

  private loadBooks(): void {
    this.bookService.getAllBooks().subscribe({
      next: (books) => {
            const bookStatsPromises = books.map(book => {
              return Promise.all([
                this.rentalService.getRentedByBook(book.id).toPromise(),
                this.rentalService.getOverdue().toPromise()
              ]).then(([rentals, overdueList]) => {
                // Broji samo iznajmljivanja koja NISU vraćena (returned_at == null)
                const activeRentals = (rentals || []).filter((r: Rental) => !r.returned_at);
                const issued = activeRentals.length;
                const reserved = (rentals || []).filter((r: Rental) => r.status === 'reserved').length;
                const overdue = (overdueList || []).filter((r: Rental) => r.book_id === book.id).length;
                const available = Math.max(0, book.number_of_copies - issued);
                return {
                  ...book,
                  available,
                  reserved,
                  issued,
                  overdue
                };
              });
            });
            Promise.all(bookStatsPromises).then((booksWithStats) => {
              this.books = booksWithStats;
              this.pagination.reset();
              this.loading = false;
            });
      },
      error: () => {
        this.loading = false;
      },
    });
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

  toggleMenu(index: number): void {
    this.openMenuIndex = this.openMenuIndex === index ? null : index;
  }

  deleteBook(book: Book): void {
    if (book.id !== undefined && confirm(`Da li ste sigurni da želite da izbrišete knjigu "${book.name}"?`)) {
      this.bookService.deleteBook(book.id).subscribe(() => {
        this.books = this.books.filter((b) => b.id !== book.id);
      });
    }
    this.openMenuIndex = null;
  }

  getCategoryNames(categories: any[]): string {
    if (!categories || categories.length === 0) return '';
    return categories.map(c => c.name).join(', ');
  }

  getGenreNames(genres: any[]): string {
    if (!genres || genres.length === 0) return '';
    return genres.map(g => g.name).join(', ');
  }

  getPublisherNames(publishers: any[]): string {
    if (!publishers || publishers.length === 0) return '';
    return publishers.map(p => p.name).join(', ');
  }

  getAuthorNames(authors: any[]): string {
    if (!authors || authors.length === 0) return '';
    return authors.map(a => `${a.first_name} ${a.last_name}`).join(', ');
  }
}
