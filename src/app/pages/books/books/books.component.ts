import { Component, OnInit, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { BookService } from '../../../services/book/book.service';
import { Book } from '../../../models/book.model';

import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { PaginationService } from '../../../shared/pagination/pagination.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, RouterLink],
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
})
export class Books implements OnInit {
deleteUser(_t28: Book) {
throw new Error('Method not implemented.');
}
editUser(_t28: Book) {
throw new Error('Method not implemented.');
}
showDetails(_t28: Book) {
throw new Error('Method not implemented.');
}
getLibrarianImageUrl(arg0: any) {
throw new Error('Method not implemented.');
}
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
        this.books = books;
        this.pagination.reset();
        this.loading = false;
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

  // --- akcije ---
  

  writeOffBook(book: Book) {
    console.log('Otpiši knjigu:', book);
  }

  issueBook(book: Book) {
    console.log('Izdaj knjigu:', book);
  }

  returnBook(book: Book) {
    console.log('Vrati knjigu:', book);
  }

  reserveBook(book: Book) {
    console.log('Rezerviši knjigu:', book);
  }

  deleteBook(book: Book): void {
    if (book.id !== undefined && confirm(`Da li ste sigurni da želite da izbrišete knjigu "${book.name}"?`)) {
      this.bookService.deleteBook(book.id).subscribe(() => {
        this.books = this.books.filter((b) => b.id !== book.id);
      });
    }
    this.openMenuIndex = null;
  }

  // --- helperi za prikaz ---
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
