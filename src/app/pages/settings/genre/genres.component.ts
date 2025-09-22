import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenreService } from '@/app/services/settings/genre/genre.service';
import { Genre } from '@/app/models/genre.model';
import { PaginationService } from '@/app/shared/pagination/pagination.service';
import { PaginationComponent } from '@/app/shared/pagination/pagination.component';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-genre',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, MatSnackBarModule],
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.css']
})
export class GenreComponent implements OnInit {
  private genreService = inject(GenreService);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  public paginationService = inject(PaginationService);

  genres: Genre[] = [];
  displayedGenres: Genre[] = [];
  selectedGenre: Genre | null = null;
  searchTerm: string = '';
  openMenuIndex: number | null = null;

  ngOnInit(): void {
    this.genres = this.route.snapshot.data['genres'].data.data;
    this.applyPagination();
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

    action.subscribe({
      next: () => {
        this.genreService.getGenres().subscribe(res => {
          this.genres = res.data.data;
          this.applyPagination();
        });

        this.selectedGenre = null;
        // snackbar feedback
        this.snackBar.open(
          genre.id ? 'Žanr je uspješno ažuriran.' : 'Novi žanr je uspješno kreiran.',
          'Zatvori',
          { duration: 3000,  horizontalPosition: 'center', verticalPosition: 'bottom' }
        );
      },
      error: (err) => {
        console.error(err);
        alert('Greška pri čuvanju žanra.');
      }
    });
  }

  deleteGenre(id: number) {
  if (confirm('Da li ste sigurni da želite da obrišete žanr?')) {
    this.genreService.deleteGenre(id).subscribe({
      next: () => {
        this.genreService.getGenres().subscribe(res => {
          this.genres = res.data.data;
          this.applyPagination();
        });
        if (this.selectedGenre?.id === id) this.selectedGenre = null;

        // Snackbar feedback za brisanje
        this.snackBar.open('Žanr je uspješno obrisan.', 'Zatvori', {
          duration: 3000,
          horizontalPosition: 'center', 
          verticalPosition: 'bottom'   
        });
      },
      error: (err) => {
        console.error(err);
        alert('Greška pri brisanju žanra.');
      }
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
    this.selectGenre(genre);
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
