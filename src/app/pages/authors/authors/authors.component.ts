import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthorService } from '../../../services/author/author.service';
import { Author } from '../../../models/author.model';
import { Router, RouterLink } from '@angular/router';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { PaginationService } from '../../../shared/pagination/pagination.service';

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, RouterLink],
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.css']
})
export class Authors implements OnInit {
  private authorService = inject(AuthorService);
  private router = inject(Router);
  pagination = inject(PaginationService);

  authors: Author[] = [];
  loading = true;
  sortDirection: 'asc' | 'desc' = 'asc';

  searchTerm: string = '';
  openMenuIndex: number | null = null;

  ngOnInit(): void {
    this.authorService.getAuthors().subscribe({
      next: authors => {
        this.authors = authors;
        this.pagination.reset();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.actions-cell')) {
      this.openMenuIndex = null;
    }
  }

  filterAuthors(): Author[] {
    let filtered = this.authors;

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(author =>
        (`${author.first_name} ${author.last_name}`).toLowerCase().includes(term) ||
        (author.biography?.toLowerCase().includes(term) ?? false)
      );
    }

    return filtered.sort((a, b) => {
      const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
      const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
      return this.sortDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
  }

  get pagedAuthors(): Author[] {
    const filtered = this.filterAuthors();
    this.pagination.updateTotal(filtered.length);
    return this.pagination.getPageSlice(filtered);
  }

  onPageChange(page: number): void {
    this.pagination.currentPage = page;
  }

  sortByName(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }

  goToNewAuthor(): void {
    this.router.navigate(['/authors/new']);
  }

  toggleMenu(index: number): void {
    this.openMenuIndex = this.openMenuIndex === index ? null : index;
  }

  showDetails(author: Author): void {
    this.router.navigate(['/authors', author.id]);
    this.openMenuIndex = null;
  }

  editAuthor(author: Author): void {
    this.router.navigate(['/authors', author.id, 'edit']);
    this.openMenuIndex = null;
  }

  deleteAuthor(author: Author): void {
    if (
      author.id !== undefined &&
      confirm(`Da li ste sigurni da želite da izbrišete autora ${author.first_name} ${author.last_name}?`)
    ) {
      this.authorService.deleteAuthor(author.id).subscribe({
        next: () => {
          this.authors = this.authors.filter(a => a.id !== author.id);
          alert(`Autor ${author.first_name} ${author.last_name} je uspešno obrisan.`);
        },
        error: (err) => {
          console.error('Greška pri brisanju autora:', err);
          alert(`Došlo je do greške prilikom brisanja autora ${author.first_name} ${author.last_name}.`);
        }
      });
    }
    this.openMenuIndex = null;
  }
}
