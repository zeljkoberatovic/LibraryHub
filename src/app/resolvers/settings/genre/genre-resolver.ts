import { Injectable, inject } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { GenreService } from '@/app/services/settings/genre/genre.service';

@Injectable({
  providedIn: 'root'
})
export class GenresResolver implements Resolve<Observable<any>> {
  private genreService = inject(GenreService);

  resolve(): Observable<any> {
    return this.genreService.getGenres();
  }
}
