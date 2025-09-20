import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenreService } from '@/app/services/settings/genre/genre.service';
import { Genre } from '@/app/models/genre.model';
import { PaginationService } from '@/app/shared/pagination/pagination.service';
import { PaginationComponent } from '@/app/shared/pagination/pagination.component';

@Component({
  selector: 'app-genre',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.css']
})
export class GenreComponent implements OnInit {
  private genreService = inject(GenreService);
  public paginationService = inject(PaginationService);

  genres: Genre[] = [];
  displayedGenres: Genre[] = [];
  selectedGenre: Genre | null = null;
  searchTerm: string = '';
  openMenuIndex: number | null = null;

  ngOnInit(): void {
    this.loadGenres();
  }

  loadGenres() {
    this.genreService.getGenres().subscribe(res => {
      this.genres = res.data.data;
      this.applyPagination();
    });
  }

  applyPagination() {
    const filtered = this.filteredGenres;
    this.paginationService.updateTotal(filtered.length);
    this.displayedGenres = this.paginationService.getPageSlice(filtered);
  }

  selectGenre(genre: Genre) {
    this.selectedGenre = { ...genre };
    this.openMenuIndex = null;
  }

  saveGenre(genre: Genre) {
    if (!genre.name) return alert('Naziv je obavezan');

    const action = genre.id
      ? this.genreService.updateGenre(genre.id, genre)
      : this.genreService.createGenre(genre);

    action.subscribe(() => {
      this.loadGenres();
      this.selectedGenre = null;
    });
  }

  deleteGenre(id: number) {
    if (confirm('Da li ste sigurni da želite da obrišete žanr?')) {
      this.genreService.deleteGenre(id).subscribe(() => {
        this.loadGenres();
        if (this.selectedGenre?.id === id) this.selectedGenre = null;
      });
    }
  }

  cancelEdit() {
    this.selectedGenre = null;
  }

  toggleMenu(index: number) {
    this.openMenuIndex = this.openMenuIndex === index ? null : index;
  }

  editGenre(genre: Genre) {
    this.selectedGenre = { ...genre };
    this.openMenuIndex = null;
  }

  get filteredGenres() {
    if (!this.searchTerm) return this.genres;
    return this.genres.filter(g =>
      g.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onPageChange(page: number) {
    this.paginationService.currentPage = page;
    this.applyPagination();
  }
}
