import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Book, CreateBookDto } from '../../models/book.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BookService {
  getCategories() {
    throw new Error('Method not implemented.');
  }
  getAuthors() {
    throw new Error('Method not implemented.');
  }
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + '/books';

  // Vraća niz knjiga iz response.data.data
  getAllBooks(): Observable<Book[]> {
    return this.http.get<{ status: string; data: { meta: any; data: Book[] } }>(`${this.baseUrl}`)
      .pipe(map(res => res.data.data));
  }

 

  getBook(id: number): Observable<Book> {
  return this.http.get<{ status: string; data: Book }>(`${this.baseUrl}/${id}`)
    .pipe(map(res => res.data));
}


  createBook(book: CreateBookDto): Observable<Book> {
  return this.http.post<{ status: string; data: Book }>(this.baseUrl, book)
    .pipe(map(res => res.data));
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
