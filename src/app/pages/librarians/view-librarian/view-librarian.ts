import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LibrarianService } from '../../../services/librarian/librarian';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-view-librarian',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-librarian.html',
  styleUrls: ['./view-librarian.css']
})
export class ViewLibrarian implements OnInit {
  private route = inject(ActivatedRoute);
  private librarianService = inject(LibrarianService);
  private router = inject(Router);

  librarian: User | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.librarianService.getLibrarian(id).subscribe({
        next: res => {
          this.librarian = res;
        },
        error: err => {
          console.error('Greška pri dohvaćanju bibliotekara', err);
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/bibliotekari']);
  }
}
