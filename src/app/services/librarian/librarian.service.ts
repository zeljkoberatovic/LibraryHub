import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LibrarianService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + '/users';

  // Vraća niz korisnika (bibliotekara) iz response.data.data
  getAllLibrarians(): Observable<User[]> {
    return this.http.get<{ data: { meta: any; data: User[] } }>(`${this.baseUrl}?role_id=2`)
      .pipe(
        map(response => response.data.data)  //   niz korisnika
      );
  }

  getLibrarian(id: number): Observable<User> {
  return this.http.get<{ status: string, data: User }>(`${this.baseUrl}/${id}`).pipe(
    map(res => res.data)
  );
}


  createLibrarian(librarian: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, { ...librarian, role_id: 2 });
  }

  updateLibrarian(id: number, librarian: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, librarian);
  }

  deleteLibrarian(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  uploadImage(id: number, file: File): Observable<any> {
  const formData = new FormData();
  formData.append('picture', file);
  return this.http.post(`${this.baseUrl}/${id}/upload-picture`, formData);
}

}
