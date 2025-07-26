import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LibrarianService } from '../../../services/librarian/librarian';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-bibliotekari',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './librarians.html'
})
export class Librarians implements OnInit {
  private librarianService = inject(LibrarianService);
  private cdr = inject(ChangeDetectorRef);

  librarians: User[] = [];
  loading = true;
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit() {
    this.librarianService.getAllLibrarians().subscribe({
      next: users => {
        console.log('Bibliotekari:', users);
        this.librarians = users;  // sada imamo niz korisnika direktno
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  filterLibrarians(): User[] {
    // Sortiraj bibliotekare po imenu u izabranom pravcu
    return this.librarians.sort((a, b) => {
      const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
      const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
      return this.sortDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
  }

  sortByName() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }
}
