import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/env';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Publisher {
  id: number;
  name: string;
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
export class PublisherService {
  private baseUrl = `${environment.apiUrl}/api/publishers`;

  constructor(private http: HttpClient) {}

  /** GET /api/publishers */
  list(): Observable<Publisher[]> {
    return this.http
      .get<ApiListResponse<Publisher>>(this.baseUrl)
      .pipe(map((res) => res.data.data));
  }

  /** POST /api/publishers */
  create(payload: { name: string }): Observable<Publisher> {
    return this.http.post<Publisher>(this.baseUrl, payload);
  }

  /** POST /api/publishers/:id */
  update(id: number, payload: { name: string }): Observable<Publisher> {
    return this.http.post<Publisher>(`${this.baseUrl}/${id}`, payload);
  }

  /** DELETE /api/publishers/:id */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
