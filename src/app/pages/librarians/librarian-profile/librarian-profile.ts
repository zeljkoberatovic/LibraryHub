import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LibrarianService } from '../librarian-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-librarian-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './librarian-profile.html',
  styleUrl: './librarian-profile.css'
})
export class LibrarianProfile {

  librarian: any = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private service: LibrarianService
  ) {}
  
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || '15';
    this.service.getLibrarian(Number(id)).subscribe({
      next: (data) => {
        this.librarian = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Greška pri učitavanju podataka!';
        this.loading = false;
      }
    });
  }

}
