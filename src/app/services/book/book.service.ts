import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Book } from '../../models/book.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BookService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + '/books';

  // Vraća niz knjiga iz response.data.data
  getAllBooks(): Observable<Book[]> {
    return this.http.get<{ data: { meta: any; data: Book[] } }>(`${this.baseUrl}`)
      .pipe(
        map(response => response.data.data)
      );
  }
  getBook(id: number): Observable<Book> {
    return this.http.get<{ status: string, data: Book }>(`${this.baseUrl}/${id}`)
      .pipe(
        map(res => res.data)
      );
  }

  createBook(book: Book): Observable<Book> {
    return this.http.post<{ data: Book }>(this.baseUrl, book)
      .pipe(
        map(res => res.data)
      );
  }

  updateBook(id: number, book: Book): Observable<Book> {
    return this.http.put<{ data: Book }>(`${this.baseUrl}/${id}`, book)
      .pipe(
        map(res => res.data)
      );
  }
  

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
