import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookService } from '../../../services/book/book.service';
import { BookDetailsFormComponent } from './book-details-form/book-details-form.component';
import { BookSpecFormComponent } from './book-spec-form/book-spec-form.component';
import { BookMediaFormComponent } from './book-media-form/book-media-form.component';
import { Book } from '../../../models/book.model';

@Component({
  selector: 'app-new-book',
  standalone: true,
  templateUrl: './new-book.component.html',
  styleUrls: ['./new-book.component.css'],
  imports: [
    CommonModule,
    BookDetailsFormComponent,
    BookSpecFormComponent,
    BookMediaFormComponent
  ]
})
export class NewBookComponent {
  private bookService = inject(BookService);
  private router = inject(Router);

  // Referince na child komponente
  @ViewChild(BookDetailsFormComponent) detailsForm!: BookDetailsFormComponent;
  @ViewChild(BookSpecFormComponent) specForm!: BookSpecFormComponent;
  @ViewChild(BookMediaFormComponent) mediaForm!: BookMediaFormComponent;

  bookData: any = {};
  activeTab: string = 'details';

  // Pratimo koje forme su popunjene
  detailsCompleted: boolean = false;
  specCompleted: boolean = false;
  mediaCompleted: boolean = false;

  onDetailsSubmit(details: any) {
    this.bookData = { ...this.bookData, ...details };
    this.detailsCompleted = true;
    console.log('Detalji sačuvani:', details);
    this.activeTab = 'specification';
  }

  onSpecSubmit(spec: any) {
    this.bookData = { ...this.bookData, ...spec };
    this.specCompleted = true;
    console.log('Specifikacije sačuvane:', spec);
    this.activeTab = 'media';
  }

  onMediaSubmit(media: any) {
    this.bookData = { ...this.bookData, ...media };
    this.mediaCompleted = true;
    console.log('Mediji sačuvani:', media);
  }

  // Finalno slanje knjige
  submitBook() {
    console.log('Svi podaci za slanje:', this.bookData);
    
    if (this.isBookDataComplete()) {
      // Osigurajmo da je authors u formatu niza brojeva
      if (typeof this.bookData.authors === 'string') {
        this.bookData.authors = this.bookData.authors.split(',').map((id: string) => parseInt(id.trim(), 10));
      } else if (Array.isArray(this.bookData.authors)) {
        this.bookData.authors = this.bookData.authors.map((id: any) => parseInt(id, 10));
      }
      
      this.bookService.createBook(this.bookData as Book).subscribe({
        next: (createdBook) => {
          console.log('Knjiga uspešno kreirana', createdBook);
          alert('Knjiga je uspešno kreirana!');
          this.router.navigate(['/books']);
        },
        error: (error) => {
          console.error('Greška pri kreiranju knjige', error);
          alert('Došlo je do greške pri kreiranju knjige: ' + error.message);
        }
      });
    } else {
      alert('Molimo popunite sve obavezne podatke u svim formama');
      console.log('Nepotpuni podaci:', this.bookData);
    }
  }

  // Provera da li su svi podaci popunjeni
  private isBookDataComplete(): boolean {
    return !!(
      this.bookData.name &&
      this.bookData.isbn &&
      this.bookData.number_of_pages &&
      this.bookData.number_of_copies &&
      this.bookData.language &&
      this.bookData.authors &&
      this.bookData.authors.length > 0
    );
  }

  onCancel() {
    if (confirm('Da li ste sigurni da želite da otkažete? Svi unešeni podaci će biti izgubljeni.')) {
      this.router.navigate(['/books']);
    }
  }

  // Funkcija za promenu tabova
  changeTab(tab: string) {
    this.activeTab = tab;
  }

  // Restartuj formu
  restartForm() {
    if (confirm('Da li ste sigurni da želite da restartujete formu? Svi podaci će biti izgubljeni.')) {
      this.bookData = {};
      this.detailsCompleted = false;
      this.specCompleted = false;
      this.mediaCompleted = false;
      this.activeTab = 'details';
      
      // Resetuj child komponente
      if (this.detailsForm) {
        this.detailsForm.bookForm.reset();
      }
      if (this.specForm) {
        this.specForm.bookForm.reset();
      }
      if (this.mediaForm) {
        this.mediaForm.mediaForm.reset();
        this.mediaForm.imagePreview = null;
      }
    }
  }
}