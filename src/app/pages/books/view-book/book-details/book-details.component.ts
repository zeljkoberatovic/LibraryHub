import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../../../../models/book.model';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetails {
  private route = inject(ActivatedRoute);
  book: Book | null = null;

  ngOnInit() {
  this.route.parent?.data.subscribe(({ book }) => {
    this.book = book;
    console.log('Book from parent route:', this.book);
  });
}


  get authorNames(): string {
    return this.book?.authors?.map(a => `${a.first_name} ${a.last_name}`).join(', ') ?? 'N/A';
  }

  get categoryNames(): string {
    return this.book?.categories?.map(c => c.name).join(', ') ?? 'N/A';
  }

  get genreNames(): string {
    return this.book?.genres?.map(g => g.name).join(', ') ?? 'N/A';
  }

  get publisherNames(): string {
    return this.book?.publishers?.map(p => p.name).join(', ') ?? 'N/A';
  }

  get year(): string {
    return this.book?.publishers?.[0]?.established_year ?? 'N/A';
  }
}
