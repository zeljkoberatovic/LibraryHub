import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '@/app/services/book/book.service';
import { Book } from '@/app/models/book.model';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetails implements OnInit {
  book?: Book;
  publisherNames: any;
  year: any;
  authorNames: any;
  genreNames: any;
  categoryNames: any;

  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.book = this.route.parent?.snapshot.data['book'];
    console.log('Book iz resolvera:', this.book);
  }
}
