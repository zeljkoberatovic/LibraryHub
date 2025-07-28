import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LibrarianService } from '../../../services/librarian/librarian';
import { User } from '../../../models/user.model';
import { Router } from '@angular/router';
import { PaginationComponent } from '../../../shared/pagination/pagination';

@Component({
  selector: 'app-bibliotekari',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './librarians.html',
  styleUrls: ['./librarians.css']
})
export class Librarians implements OnInit, OnDestroy {
  private librarianService = inject(LibrarianService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  librarians: User[] = [];
  loading = true;
  sortDirection: 'asc' | 'desc' = 'asc';

  searchTerm: string = '';
  openMenuIndex: number | null = null;

  // Pagination
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  private handleDocumentClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.actions-cell')) {
      this.openMenuIndex = null;
      this.cdr.detectChanges();
    }
  };

  ngOnInit() {
    this.librarianService.getAllLibrarians().subscribe({
      next: users => {
        console.log('Bibliotekari:', users);
        this.librarians = users;
        this.updatePagination();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
      }
    });

    document.addEventListener('click', this.handleDocumentClick);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleDocumentClick);
  }

  filterLibrarians(): User[] {
    let filtered = this.librarians;

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(lib =>
        (`${lib.first_name} ${lib.last_name}`).toLowerCase().includes(term) ||
        lib.email.toLowerCase().includes(term)
      );
    }

    return filtered.sort((a, b) => {
      const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
      const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
      return this.sortDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
  }

  // Vrati samo bibliotekare za trenutnu stranicu
  get pagedLibrarians(): User[] {
    const filtered = this.filterLibrarians();
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage) || 1;

    const start = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(start, start + this.itemsPerPage);
  }

  updatePagination() {
    const filteredLength = this.filterLibrarians().length;
    this.totalPages = Math.ceil(filteredLength / this.itemsPerPage) || 1;
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  sortByName() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }

  goToNewLibrarian() {
    this.router.navigate(['/noviBibliotekar']);
  }

  toggleMenu(index: number) {
    if (this.openMenuIndex === index) {
      this.openMenuIndex = null;
    } else {
      this.openMenuIndex = index;
    }
  }

  showDetails(librarian: User) {
    console.log('Detalji korisnika:', librarian);
    this.openMenuIndex = null;
  }

  editUser(librarian: User) {
    console.log('Izmjena korisnika:', librarian);
    this.openMenuIndex = null;
  }

  deleteUser(librarian: User) {
    console.log('Brisanje korisnika:', librarian);
    this.openMenuIndex = null;
  }
}
