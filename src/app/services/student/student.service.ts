import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + '/users';

  
  getAllStudents(): Observable<User[]> {
    return this.http.get<{ data: { meta: any; data: User[] } }>(`${this.baseUrl}?role_id=1`)
      .pipe(map(response => response.data.data));
  }

  getStudent(id: number): Observable<User> {
    return this.http.get<{ status: string, data: User }>(`${this.baseUrl}/${id}`)
      .pipe(map(res => res.data));
  }

  createStudent(student: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, { ...student, role_id: 1 });
  }

  updateStudent(id: number, student: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, { ...student, role_id: 1 });
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  uploadImage(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('picture', file); 
    return this.http.post(`${this.baseUrl}/${id}/upload-picture`, formData);
  }

  getStudentImageUrl(picturePath?: string): string {
  if (!picturePath) {
    return 'assets/default-user.png';
  }
  return `${environment.imageBaseUrl}${picturePath}`;
}



}
