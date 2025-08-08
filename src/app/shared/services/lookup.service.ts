import { Injectable }      from '@angular/core';
import { HttpClient }      from '@angular/common/http';
import { environment }     from '../../../environments/environment';
import { Observable }      from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

interface Book {
  binding: string;
  dimensions: string;
  language: string;
  script: string;
}

@Injectable({ providedIn: 'root' })
export class LookupService {
  private url = `${environment.apiUrl}/api/books`;
  private books$: Observable<Book[]>;

 constructor(private http: HttpClient) {
  this.books$ = this.http
    .get<{
      status: string;
      data: {
        meta: any;
        data: Book[];
      };
    }>(this.url)
    .pipe(
      
      map(resp => resp.data),
    
      map(d => d.data),
      
      shareReplay(1)
    );
}

  getBindings(): Observable<string[]> {
    return this.books$.pipe(
      map(bs => Array.from(new Set(bs.map(b => b.binding))))
    );
  }

  getFormats(): Observable<string[]> {
    return this.books$.pipe(
      map(bs => Array.from(new Set(bs.map(b => b.dimensions))))
    );
  }

  getLanguages(): Observable<string[]> {
    return this.books$.pipe(
      map(bs => Array.from(new Set(bs.map(b => b.language))))
    );
  }

  getScripts(): Observable<string[]> {
    return this.books$.pipe(
      map(bs => Array.from(new Set(bs.map(b => b.script))))
    );
  }
}
