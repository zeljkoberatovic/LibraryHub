import { Component } from '@angular/core';
import { LibrarianService } from '../librarian-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-librarians',
  imports: [FormsModule, CommonModule, RouterModule],
  standalone: true,
  templateUrl: './librarians.html',
  styleUrl: './librarians.css'
})
export class Librarians {

  librarians: any[] = [];
  searchText: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private service: LibrarianService) {}

  ngOnInit(): void {
    this.fetchLibrarians();
  }

  fetchLibrarians(): void {
  this.service.getAllLibrarians().subscribe({
    next: (response) => {
      this.librarians = response?.data || [];
    },
    error: (err) => {
      console.error('Error loading librarians:', err);
    }
  });
  }

  filterLibrarians(): any[] {
    return this.librarians.filter(l => 
      l.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      l.email.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  sortByName(): void {
  const direction = this.sortDirection === 'asc' ? 1 : -1;
  this.librarians.sort((a, b) => {
    return a.name.localeCompare(b.name) * direction;
  });
  this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }
}
