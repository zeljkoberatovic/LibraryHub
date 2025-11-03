import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RentalService } from '@/app/services/rental/rental.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '@/app/services/student/student.service';
import { LibrarianService } from '@/app/services/librarian/librarian.service';
import { Rental } from '@/app/models/rental.model';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-return-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './return-book.component.html',
  styleUrls: ['./return-book.component.css']
})
export class ReturnBookComponent implements OnInit {
  rentedCopies: any[] = [];
  bookId?: number;
  loading = true;

  rentalService = inject(RentalService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  studentService = inject(StudentService);
  librarianService = inject(LibrarianService);
  location = inject(Location);
  http = inject(HttpClient);

  ngOnInit() {
    this.bookId = Number(this.route.parent?.parent?.snapshot.paramMap.get('id'));
    if (this.bookId) {
      this.loadAllRentedCopies();
    }
  }

  private loadAllRentedCopies(): void {
    this.loading = true;
    let allRentals: Rental[] = [];
    let currentPage = 1;
    const baseUrl = 'https://cortex-api.fabrika.me/api/rentals';

    const loadPage = (page: number) => {
      const url = `${baseUrl}?book_id=${this.bookId}&page=${page}`;
      
      this.http.get<any>(url).subscribe({
        next: (response: any) => {
          if (response.status === 'success' && response.data) {
            let rentals = response.data.data || response.data.rentals || response.data;
            let meta = response.data.meta || response.data.pagination || response.meta;
            
            if (Array.isArray(rentals)) {
              // FILTRIRAJ SAMO AKTIVNE (NEVRAĆENE) RENTALS
              const activeRentals = rentals.filter(rental => 
                rental.returned_at === null || 
                rental.returned_at === undefined || 
                rental.returned_at === ''
              );
              allRentals = [...allRentals, ...activeRentals];
            } else if (typeof response.data === 'object' && !Array.isArray(response.data)) {
              for (const key of Object.keys(response.data)) {
                if (Array.isArray(response.data[key])) {
                  // FILTRIRAJ SAMO AKTIVNE RENTALS
                  const activeRentals = response.data[key].filter(rental => 
                    rental.returned_at === null || 
                    rental.returned_at === undefined || 
                    rental.returned_at === ''
                  );
                  allRentals = [...allRentals, ...activeRentals];
                  break;
                }
              }
            }
            
            if (meta && meta.current_page < meta.last_page) {
              loadPage(page + 1);
            } else {
              this.processRentals(allRentals);
            }
          } else {
            this.processRentals([]);
          }
        },
        error: () => {
          this.processRentals(allRentals);
        }
      });
    };

    loadPage(currentPage);
  }

  private processRentals(rentals: Rental[]): void {
    this.rentedCopies = rentals.map(copy => ({
      ...copy,
      selected: false,
      studentName: '',
      librarianName: ''
    }));

    // Učitaj imena studenata i bibliotekara
    this.rentedCopies.forEach(copy => {
      if (copy.student_id) {
        this.studentService.getStudent(copy.student_id).subscribe({
          next: (stu) => {
            copy.studentName = stu ? `${stu.first_name} ${stu.last_name}` : `ID: ${copy.student_id}`;
          },
          error: () => {
            copy.studentName = `ID: ${copy.student_id}`;
          }
        });
      }
      if (copy.librarian_id) {
        this.librarianService.getLibrarian(copy.librarian_id).subscribe({
          next: (lib) => {
            copy.librarianName = lib ? `${lib.first_name} ${lib.last_name}` : `ID: ${copy.librarian_id}`;
          },
          error: () => {
            copy.librarianName = `ID: ${copy.librarian_id}`;
          }
        });
      }
    });

    this.loading = false;
  }

  cancel() {
    this.location.back();
  }

  returnBook() {
    const selected = this.rentedCopies.find(c => c.selected);
    if (!selected) {
      alert('Niste odabrali knjigu za vraćanje.');
      return;
    }
    
    console.log('Attempting to return book:', selected);
    this.loading = true;
    
    this.rentalService.returnBook(
      selected.id,
      this.bookId!,
      selected.librarian_id,
      selected.student_id
    ).subscribe({
      next: (response) => {
        console.log('Return successful:', response);
        alert('Knjiga je uspešno vraćena!');
        
        // Ukloni vraćenu knjigu iz lokalne liste odmah
        this.rentedCopies = this.rentedCopies.filter(copy => copy.id !== selected.id);
        
        // Sačekaj malo pa navigiraj na vraćene knjige
        setTimeout(() => {
          this.router.navigate(['books', 'view', this.bookId, 'records', 'returned']);
        }, 1000); // Sačekaj 1 sekund da se API ažurira
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Return error:', error);
        this.loading = false;
        
        if (error.status === 422) {
          alert('Ova knjiga je već vraćena ili postoji problem sa podacima.');
          // Osveži listu da ukloniš već vraćene knjige
          this.loadAllRentedCopies();
        } else {
          alert(`Greška prilikom vraćanja knjige: ${error.message || error.statusText}`);
        }
      }
    });
  }

  calculateDaysHeld(rentedDate?: string | Date): number {
    if (!rentedDate) return 0;
    const today = new Date();
    const rented = new Date(rentedDate);
    return Math.max(0, Math.floor((today.getTime() - rented.getTime()) / (1000 * 60 * 60 * 24)));
  }
}