import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LibrarianService } from '../../../services/librarian/librarian';
import { User } from '../../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bibliotekari',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './librarians.html',
  styleUrls: ['./librarians.css']
})

export class Librarians implements OnInit {
  private librarianService = inject(LibrarianService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  librarians: User[] = [];
  loading = true;
  sortDirection: 'asc' | 'desc' = 'asc';

  searchTerm: string = '';  // nova promenljiva za pretragu

  ngOnInit() {
    this.librarianService.getAllLibrarians().subscribe({
      next: users => {
        console.log('Bibliotekari:', users);
        this.librarians = users;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
      }
    });
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

  sortByName() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }

  goToNewLibrarian() {
    this.router.navigate(['/noviBibliotekar']);
  }
}
