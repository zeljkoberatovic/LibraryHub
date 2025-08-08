import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string | null;
}

interface ApiListResponse {
  status: string;
  data: {
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
    data: Category[];
  };
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private baseUrl = `${environment.apiUrl}/api/categories`;

  constructor(private http: HttpClient) {}

  /** GET /api/categories */
  list(): Observable<Category[]> {
    return this.http.get<ApiListResponse>(this.baseUrl).pipe(
      map((response) =>
        // response.data.data is the array from the server
        response.data.data.map((cat) => ({
          id: cat.id,
          name: cat.name,
          description: cat.description,
          // backend calls it `icon`, but your component wants `iconUrl`
          icon: cat.icon,
        }))
      )
    );
  }

  /** GET /api/categories/:id */
  get(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${id}`);
  }

  /** POST /api/categories */
  create(formData: FormData): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, formData);
  }

  /** POST or PUT /api/categories/:id */
  update(id: number, formData: FormData): Observable<Category> {
    // adjust to PUT if your backend expects PUT
    return this.http.post<Category>(`${this.baseUrl}/${id}`, formData);
  }

  /** DELETE /api/categories/:id */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
