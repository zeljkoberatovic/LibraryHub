import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { LibrarianService } from '../../../services/librarian/librarian.service';
import { User } from '../../../models/user.model';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { PaginationService } from '../../../shared/pagination/pagination.service';

@Component({
  selector: 'app-librarians',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, RouterLink],
  templateUrl: './librarians.component.html',
  styleUrls: ['./librarians.component.css']
})
export class Librarians implements OnInit {
  private librarianService = inject(LibrarianService);
  private router = inject(Router);
  pagination = inject(PaginationService);

  librarians: User[] = [];
  loading = true;
  sortDirection: 'asc' | 'desc' = 'asc';
  searchTerm: string = '';
  openMenuIndex: number | null = null;

  ngOnInit(): void {
    this.librarianService.getAllLibrarians().subscribe({
      next: users => {
        this.librarians = users;
        this.pagination.reset();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.actions-cell')) this.openMenuIndex = null;
  }

  getLibrarianImageUrl(picture?: string | null): string {
    return this.librarianService.getLibrarianImageUrl(picture ?? undefined);
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

  get paged(): User[] {
    const filtered = this.filterLibrarians();
    this.pagination.updateTotal(filtered.length);
    return this.pagination.getPageSlice(filtered);
  }

  onPageChange(page: number): void {
     this.pagination.currentPage = page; }

  sortByName(): void {
     this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'; }

  goToNewLibrarian(): void {
     this.router.navigate(['/librarians/new']); }

  toggleMenu(index: number): void {
     this.openMenuIndex = this.openMenuIndex === index ? null : index; }

  showDetails(lib: User): void {
     this.router.navigate(['/librarians', lib.id]);
      this.openMenuIndex = null; }

  editUser(lib: User): void {
     this.router.navigate(['/librarians', lib.id, 'edit']);
      this.openMenuIndex = null; }

  deleteUser(lib: User): void {
    if (lib.id === undefined) return;
    if (!confirm(`Da li ste sigurni da želite da izbrišete korisnika ${lib.first_name} ${lib.last_name}?`)) return;

    this.librarianService.deleteLibrarian(lib.id).subscribe({
      next: () => {
        this.librarians = this.librarians.filter(l => l.id !== lib.id);
        alert(`Korisnik ${lib.first_name} ${lib.last_name} je uspešno obrisan.`);
      },
      error: () => alert(`Došlo je do greške prilikom brisanja korisnika ${lib.first_name} ${lib.last_name}.`)
    });

    this.openMenuIndex = null;
  }
}
