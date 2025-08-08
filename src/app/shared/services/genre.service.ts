import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Genre {
  id: number;
  name: string;
  description: string;
}

interface ApiListResponse<T> {
  status: string;
  data: {
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
    data: T[];
  };
}

@Injectable({ providedIn: 'root' })
export class GenreService {
  private baseUrl = `${environment.apiUrl}/api/genres`;

  constructor(private http: HttpClient) {}

  /** GET /api/genres */
  list(): Observable<Genre[]> {
    return this.http
      .get<ApiListResponse<Genre>>(this.baseUrl)
      .pipe(map((res) => res.data.data));
  }

  /** POST /api/genres */
  create(payload: { name: string; description: string }): Observable<Genre> {
    return this.http.post<Genre>(this.baseUrl, payload);
  }

  /** POST or PUT /api/genres/:id */
  update(
    id: number,
    payload: { name: string; description: string }
  ): Observable<Genre> {
    return this.http.post<Genre>(`${this.baseUrl}/${id}`, payload);
  }

  /** DELETE /api/genres/:id */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
