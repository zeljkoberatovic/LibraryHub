import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Genre } from '@/app/models/genre.model';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/genres`;

  // GET /genres
  getGenres(perPage: number = 20): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?per_page=${perPage}`);
  }

  // GET /genres/:id
  getGenre(id: number): Observable<Genre> {
    return this.http.get<Genre>(`${this.apiUrl}/${id}`);
  }

  // POST /genres
  createGenre(genre: Genre): Observable<Genre> {
    return this.http.post<Genre>(this.apiUrl, genre);
  }

  // PUT /genres/:id
  updateGenre(id: number, genre: Genre): Observable<Genre> {
    return this.http.put<Genre>(`${this.apiUrl}/${id}`, genre);
  }

  // DELETE /genres/:id
  deleteGenre(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
