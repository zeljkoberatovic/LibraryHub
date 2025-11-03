import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@/environments/environment';
import { Rental } from '@/app/models/rental.model';

@Injectable({ providedIn: 'root' })
export class RentalService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/rentals`;

  /** Dohvati sva iznajmljivanja */
  getAllRentals(): Observable<Rental[]> {
    return this.http
      .get<{ status: string; data: { meta: any; data: Rental[] } }>(this.baseUrl)
      .pipe(map(res => res.data.data));
  }

  getRentalById(rentalId: number): Observable<Rental | undefined> {
    return this.http.get<any>(`${this.baseUrl}/${rentalId}`).pipe(
      map(res => res.data || res)
    );
  }

  /** Iznajmi knjigu (POST /rent) */
  rentBook(bookId: number, studentId: number, librarianId: number): Observable<any> {
    const payload = { book_id: bookId, student_id: studentId, librarian_id: librarianId };
    return this.http.post(`${this.baseUrl}/rent`, payload);
  }

  /** Rezerviši knjigu (POST /reserve) - endpoint čeka backend implementaciju */
  reserveBook(
    bookId: number,
    studentId: number,
    librarianId: number,
    reservationDate: string
  ): Observable<any> {
    const payload = {
      book_id: bookId,
      student_id: studentId,
      librarian_id: librarianId,
      reservation_date: reservationDate
    };
    return this.http.post(`${this.baseUrl}/reserve`, payload);
  }

  /** Vrati knjigu */
  returnBook(rentalId: number, bookId: number, librarianId: number, studentId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/${rentalId}/return`,
      { book_id: bookId, librarian_id: librarianId, student_id: studentId }
    );
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

  deleteRental(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  /** Dohvati iznajmljivanja za određenu knjigu */
  getRentedByBook(bookId: number): Observable<Rental[]> {
    return this.http
      .get<{ status: string; data: { meta: any; data: Rental[] } }>(`${this.baseUrl}?book_id=${bookId}`)
      .pipe(map(res => res.data.data));
  }
}