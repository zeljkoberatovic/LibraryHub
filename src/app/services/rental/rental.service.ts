import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Rental } from '../../models/rental.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RentalService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + '/rentals';

  /** Dohvati sva iznajmljivanja */
  getAllRentals(): Observable<Rental[]> {
    return this.http.get<{ status: string, data: { meta: any, data: Rental[] } }>(`${this.baseUrl}`)
      .pipe(map(res => res.data.data));
  }

  /** Iznajmi knjigu */
  rentBook(bookId: number, studentId: number, librarianId: number): Observable<any> {
    const payload = { book_id: bookId, student_id: studentId, librarian_id: librarianId };
    return this.http.post<any>(`${this.baseUrl}/rent`, payload);
  }

  /** Vrati knjigu */
  returnBook(rentalId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/return/${rentalId}`, {});
  }

  /** Dohvati prekasno vraćene knjige */
  getOverdue(): Observable<Rental[]> {
    return this.http.get<{ status: string, data: { meta: any, data: Rental[] } }>(`${this.baseUrl}/overdue`)
      .pipe(map(res => res.data.data));
  }

  /** Dohvati trenutno iznajmljene knjige */
  getRented(): Observable<Rental[]> {
    return this.http.get<{ status: string, data: { meta: any, data: Rental[] } }>(`${this.baseUrl}/rented`)
      .pipe(map(res => res.data.data));
  }

  /** Dohvati samo vraćene knjige */
  getReturned(): Observable<Rental[]> {
    return this.http.get<{ status: string, data: { meta: any, data: Rental[] } }>(`${this.baseUrl}/returned`)
      .pipe(map(res => res.data.data));
  }

  /** Statistika iznajmljivanja */
  getRentalSummary(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/summary`);
  }

  /** Opcionalno: Dohvati sva iznajmljivanja za određenu knjigu */
  getAllRentalsForBook(bookId: number): Observable<Rental[]> {
  return this.http
    .get<{ status: string; data: { meta: any; data: Rental[] } }>(
      `${this.baseUrl}/rented`
    )
    .pipe(
      map((res) => res.data.data.filter((r) => r.book_id === bookId))
    );
}

}
