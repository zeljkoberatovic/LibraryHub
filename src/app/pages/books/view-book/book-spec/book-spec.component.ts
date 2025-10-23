import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from '@/app/models/book.model';


@Component({
  selector: 'app-book-spec',
  standalone: true,
  imports: [],
  templateUrl: './book-spec.component.html',
  styleUrls: ['./book-spec.component.css']
})
export class BookSpec implements OnInit {
  book?: Book;
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.book = this.route.parent?.snapshot.data['book'];
  }

  getPublisherNames(): string {
    return this.book?.publishers?.map(p => p.name).join(', ') || '';
  }

  getAuthorNames(): string {
    return this.book?.authors?.map(a => `${a.first_name} ${a.last_name}`).join(', ') || '';
  }

  getCategoryNames(): string {
    return this.book?.categories?.map(c => c.name).join(', ') || '';
  }

  getGenreNames(): string {
    return this.book?.genres?.map(g => g.name).join(', ') || '';
  }
}
