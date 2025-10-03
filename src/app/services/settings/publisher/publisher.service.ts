import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Publisher } from '@/app/models/publisher.model';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/publishers`; 

  // GET /publishers
  getPublishers(perPage: number = 20): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?per_page=${perPage}`);
  }

  // GET /publishers/:id
  getPublisher(id: number): Observable<Publisher> {
    return this.http.get<Publisher>(`${this.apiUrl}/${id}`);
  }

  // POST /publishers
  createPublisher(publisher: Publisher): Observable<Publisher> {
    return this.http.post<Publisher>(this.apiUrl, publisher);
  }

  // PUT /publishers/:id
  updatePublisher(id: number, publisher: Publisher): Observable<Publisher> {
    return this.http.put<Publisher>(`${this.apiUrl}/${id}`, publisher);
  }

  // DELETE /publishers/:id
  deletePublisher(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
