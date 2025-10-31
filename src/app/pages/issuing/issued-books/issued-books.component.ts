import { Component, OnInit } from '@angular/core';
import { BookService } from '@/app/services/book/book.service';
import { DatePipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-issued-books',
  templateUrl: './issued-books.component.html',
  styleUrls: ['./issued-books.component.css'],
  standalone: true,
  imports: [DatePipe, JsonPipe]
})
export class IssuedBooksComponent implements OnInit {
  issuedBooks: any[] = [];
  loading = true;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.getIssuedBooks().subscribe({
      next: (books) => {
        console.log('API issued books:', books); // Provera
        this.issuedBooks = books;
        this.loading = false;
      },
      error: (err) => {
        console.error('API error:', err);
        this.loading = false;
      }
    });
  }
}