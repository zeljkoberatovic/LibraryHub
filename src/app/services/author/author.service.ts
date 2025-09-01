import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Author } from '../../models/author.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthorService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + '/authors';

  getAuthors(): Observable<Author[]> {
    return this.http
      .get<{ status: string; data: { meta: any; data: Author[] } }>(this.baseUrl)
      .pipe(map(response => response.data.data));
  }

  getAuthor(id: number): Observable<Author> {
    return this.http
      .get<{ data: Author }>(`${this.baseUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  getAuthorImageUrl(picturePath?: string): string {
    if (!picturePath) {
      return 'assets/default-user.png';
    }
    return `${environment.imageBaseUrl}${picturePath}`;
  }

  createAuthor(data: { first_name: string; last_name: string; biography: string }): Observable<Author> {
    return this.http.post<Author>(this.baseUrl, data).pipe(
      catchError(error => throwError(() => error))
    );
  }

  updateAuthor(id: number, formData: FormData): Observable<Author> {
    return this.http.post<Author>(`${this.baseUrl}/${id}`, formData).pipe(
      catchError(error => throwError(() => error))
    );
  }

  deleteAuthor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
