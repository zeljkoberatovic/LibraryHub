import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../models/user.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-view-librarian',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-librarian.component.html',
  styleUrls: ['./view-librarian.component.css']
})
export class ViewLibrarian implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  librarian: User | null = null;
  imageBaseUrl = environment.imageBaseUrl;

  
 ngOnInit(): void {
  const resolvedLibrarian = this.route.snapshot.data['librarian'];

  if (resolvedLibrarian) {
    this.librarian = resolvedLibrarian;

   if (this.librarian?.profile_picture && !this.librarian.profile_picture.startsWith('http')) {
  this.librarian.profile_picture = environment.imageBaseUrl + this.librarian.profile_picture;
}

  } else {
    alert('Bibliotekar nije pronađen.');
    this.router.navigate(['/bibliotekari']);
  }
}


  get profilePictureUrl(): string {
    return this.librarian?.profile_picture ?? 'assets/default-user.png';
  }

  goBack() {
    this.router.navigate(['/bibliotekari']);
  }
}
