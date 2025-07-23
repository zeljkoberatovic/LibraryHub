import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const apiUrl = "https://cortex-api.fabrika.me";

@Injectable({
  providedIn: 'root'
})
export class LibrarianService {

  constructor(private http: HttpClient) {}

  createLibrarian(user: any): Observable<any> {
    return this.http.post(apiUrl + '/api/users', user);
  }

  getLibrarian(librarianId: number): Observable<any> {
    return this.http.get(apiUrl + `/api/users/${librarianId}`);
  }

  getAllLibrarians(): Observable<any> {
    return this.http.get(apiUrl + '/api/users?per_page=20&role_id=2');
  }

  updateLibrarian(librarianId: number): Observable<any> {
    return this.http.get(apiUrl + `/api/users/${librarianId}?_method=PUT`);
  }
  
  uploadLibrarianPicture(librarianId: number, profilePicture: File): Observable<any> {
    const formData = new FormData();
    formData.append('picture', profilePicture);

    return this.http.post(apiUrl + `/api/users/${librarianId}/upload-picture`, formData);
  }

  deleteLibrarian(librarianId: number): Observable<any> {
    return this.http.delete(apiUrl + `/api/users/${librarianId}`);
  }
  
}
