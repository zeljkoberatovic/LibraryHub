import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@/environments/environment';
import { Rental } from '@/app/models/rental.model';

@Injectable({ providedIn: 'root' })
export class RentalService {
  /** Dohvati prekoracene knjige */
  getBook(foundId: number) {
    throw new Error('Method not implemented.');
  }
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/rentals`;

  /**Dohvati sva iznajmljivanja */
  getAllRentals(): Observable<Rental[]> {
    return this.http
      .get<{ status: string; data: { meta: any; data: Rental[] } }>(this.baseUrl)
      .pipe(map(res => res.data.data));
  }

  getRentalById(rentalId: number): Observable<Rental | undefined> {
    return this.getRented().pipe(
      map(rentals => rentals.find(r => r.id === rentalId))
    );
  }

  /** Iznajmi knjigu (POST /rent) */
  rentBook(bookId: number, studentId: number, librarianId: number): Observable<any> {
    const payload = { book_id: bookId, student_id: studentId, librarian_id: librarianId };
    return this.http.post(`${this.baseUrl}/rent`, payload);
  }

  /** Vrati knjigu */
  returnBook(rentalId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/return/${rentalId}`, {});
  }

  /** Dohvati trenutno iznajmljene knjige */
  getRented(): Observable<Rental[]> {
    return this.http
      .get<{ status: string; data: { meta: any; data: Rental[] } }>(`${this.baseUrl}/rented`)
      .pipe(map(res => res.data.data));
  }

  /** Dohvati samo vraćene knjige */
  getReturned(): Observable<Rental[]> {
    return this.http
      .get<{ status: string; data: { meta: any; data: Rental[] } }>(`${this.baseUrl}/returned`)
      .pipe(map(res => res.data.data));
  }

  /** Dohvati prekoracene knjige */
  getOverdue(): Observable<Rental[]> {
    return this.http
      .get<{ status: string; data: { meta: any; data: Rental[] } }>(`${this.baseUrl}/overdue`)
      .pipe(map(res => res.data.data));
  }

  /** Statistika iznajmljivanja */
  getRentalSummary(): Observable<any> {
    return this.http.get(`${this.baseUrl}/summary`);
  }

  /**
   * Dohvati iznajmljene knjige za određenu knjigu (book_id)
   * Filtrira na osnovu book_id i vraca samo aktivne (rented_at != null && returned_at == null)
   */
  getRentedByBook(bookId: number): Observable<Rental[]> {
    return this.http
      .get<{ status: string; data: { meta: any; data: Rental[] } }>(`${this.baseUrl}/rented`)
      .pipe(
        map(res =>
          (res.data.data || []).filter(r => r.book_id === bookId && r.returned_at === null)
        )
      );
  }
}