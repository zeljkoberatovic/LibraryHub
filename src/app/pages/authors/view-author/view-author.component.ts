import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Author } from '../../../models/author.model';
import { AuthorService } from '../../../services/author/author.service';

@Component({
  selector: 'app-view-author',
  standalone: true,
  imports: [],
  templateUrl: './view-author.component.html',
  styleUrls: ['./view-author.component.css']
})
export class ViewAuthor implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authorService = inject(AuthorService);

  author: Author | null = null;

  ngOnInit(): void {
    const resolvedAuthor = this.route.snapshot.data['author'] as Author | null;
    if (resolvedAuthor) {
      this.author = resolvedAuthor;
    } else {
      alert('Autor nije pronađen.');
      this.router.navigate(['/authors']);
    }
  }

  getAuthorImageUrl(picture?: string | null): string {
    return this.authorService.getAuthorImageUrl(picture ?? undefined);
  }

  goBack() {
    this.router.navigate(['/authors']);
  }
}
