import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LibrarianService } from '../../../services/librarian/librarian.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-view-librarian',
  standalone: true,
  templateUrl: './view-librarian.component.html',
  styleUrls: ['./view-librarian.component.css']
})
export class ViewLibrarian implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private librarianService = inject(LibrarianService);

  librarian: User | null = null;

  ngOnInit(): void {
    const resolvedLibrarian = this.route.snapshot.data['librarian'];
    if (resolvedLibrarian) {
      this.librarian = resolvedLibrarian;
    } else {
      alert('Bibliotekar nije pronađen.');
      this.router.navigate(['/librarians']);
    }
  }

  getProfilePictureUrl(): string {
    return this.librarianService.getLibrarianImageUrl(this.librarian?.profile_picture ?? undefined);
  }

  goBack() {
    this.router.navigate(['/librarians']);
  }
}
