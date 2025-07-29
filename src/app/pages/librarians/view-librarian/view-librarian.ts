import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
  private router = inject(Router);

  librarian: User | null = null;

  ngOnInit(): void {
    const resolvedLibrarian = this.route.snapshot.data['librarian'];
     //console.log('Podaci iz resolvera:', resolvedLibrarian);
    if (resolvedLibrarian) {
      this.librarian = resolvedLibrarian;
    } else {
      alert('Bibliotekar nije pronađen.');
      this.router.navigate(['/bibliotekari']);
    }
  }

  goBack() {
    this.router.navigate(['/bibliotekari']);
  }
}
