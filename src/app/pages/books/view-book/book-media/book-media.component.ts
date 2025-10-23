import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '@/app/services/book/book.service';
import { Book } from '@/app/models/book.model';


@Component({
  selector: 'app-book-media',
  standalone: true,
  imports: [],
  templateUrl: './book-media.component.html',
  styleUrls: ['./book-media.component.css']
})
export class BookMedia implements OnInit {
  book?: Book;
  private route = inject(ActivatedRoute);
  private bookService = inject(BookService);
  private router = inject(Router); 

  ngOnInit(): void {
    const bookId = Number(this.route.parent?.snapshot.paramMap.get('id'));
    if (bookId) {
      this.bookService.getBook(bookId).subscribe(book => this.book = book);
    }
  }
}
