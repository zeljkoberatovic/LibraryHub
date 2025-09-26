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
    return this.http.get<{ status: string; data: { meta: any; data: Book[] } }>(`${this.baseUrl}`)
      .pipe(map(res => res.data.data));
  }

  // Vraća jednu knjigu iz response.data.data[0]
  //getBook(id: number): Observable<Book> {
   // return this.http.get<{ status: string; data: { meta: any; data: Book[] } }>(`${this.baseUrl}/${id}`)
     // .pipe(map(res => res.data.data[0]));
  //}

  getBook(id: number): Observable<Book> {
  return this.http.get<{ status: string; data: Book }>(`${this.baseUrl}/${id}`)
    .pipe(map(res => res.data));
}


  createBook(book: Book): Observable<Book> {
    return this.http.post<{ status: string; data: { data: Book[] } }>(this.baseUrl, book)
      .pipe(map(res => res.data.data[0]));
  }

  updateBook(id: number, book: Book): Observable<Book> {
    return this.http.put<{ status: string; data: { data: Book[] } }>(`${this.baseUrl}/${id}`, book)
      .pipe(map(res => res.data.data[0]));
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getBookImageUrl(picturePath?: string): string {
    if (!picturePath) {
      return 'assets/default-user.png';
    }
    return `${environment.imageBaseUrl}${picturePath}`;
  }
}
