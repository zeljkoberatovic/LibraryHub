import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../../../../models/book.model';


@Component({
  selector: 'app-book-spec',
  standalone: true,
  imports: [],
  templateUrl: './book-spec.component.html',
  styleUrls: ['./book-spec.component.css']
})
export class BookSpec implements OnInit {
  book?: Book;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // child route, book dolazi iz parent resolvera
    this.book = this.route.parent?.snapshot.data['book'];
  }

  getPublisherNames(): string {
  return this.book?.publishers.map(p => p.name).join(', ') || '';
}

getAuthorNames(): string {
  return this.book?.authors.map(a => a.first_name + ' ' + a.last_name).join(', ') || '';
}

getCategoryNames(): string {
  return this.book?.categories.map(c => c.name).join(', ') || '';
}

getGenreNames(): string {
  return this.book?.genres.map(g => g.name).join(', ') || '';
}

}
