import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Author } from '../../models/author.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthorService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + '/authors';

getAuthors(): Observable<Author[]> {
  return this.http.get<{ status: string; data: { meta: any; data: Author[] } }>(this.baseUrl)
    .pipe(
      map(response => response.data.data)  
    );
}

  getAuthor(id: number): Observable<Author> {
    return this.http.get<{ data: Author }>(`${this.baseUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  createAuthor(author: Author): Observable<Author> {
    return this.http.post<Author>(this.baseUrl, author);
  }

  updateAuthor(id: number, author: Author): Observable<Author> {
    return this.http.put<Author>(`${this.baseUrl}/${id}`, author);
  }

  deleteAuthor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  uploadImage(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', file);
    return this.http.post(`${this.baseUrl}/${id}/upload-picture`, formData);
  }
}
