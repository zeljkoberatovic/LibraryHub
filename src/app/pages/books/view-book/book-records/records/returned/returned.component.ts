import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RentalService } from '@/app/services/rental/rental.service';
import { StudentService } from '@/app/services/student/student.service';
import { LibrarianService } from '@/app/services/librarian/librarian.service';
import { Rental } from '@/app/models/rental.model';
import { User } from '@/app/models/user.model';
import { PaginationService } from '@/app/shared/pagination/pagination.service';
import { PaginationComponent } from "@/app/shared/pagination/pagination.component";
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Component({
  selector: 'app-returned',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './returned.component.html',
  styleUrls: ['./returned.component.css']
})
export class ReturnedComponent implements OnInit {
  returnedRentals: Rental[] = [];
  students: User[] = [];
  librarians: User[] = [];
  loading = true;

  rentalService = inject(RentalService);
  studentService = inject(StudentService);
  librarianService = inject(LibrarianService);
  pagination = inject(PaginationService);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  bookId: number | null = null;

  ngOnInit(): void {
    this.bookId = Number(this.route.parent?.parent?.snapshot.paramMap.get('id'));
    this.loadAllData();
  }

  private loadAllData(): void {
    this.loading = true;
    
    // Učitaj studente i bibliotekare
    this.studentService.getAllStudents().subscribe(students => {
      this.students = students;
    });

    this.librarianService.getAllLibrarians().subscribe(librarians => {
      this.librarians = librarians;
    });

    // Učitaj vraćene rentals sa paginacijom
    this.loadAllReturnedRentals();
  }

  private loadAllReturnedRentals(): void {
    let allRentals: Rental[] = [];
    let currentPage = 1;
    const baseUrl = `${environment.apiUrl}/rentals`; 

    const loadPage = (page: number) => {
      // Filter za vraćene knjige za određenu knjigu
      const url = `${baseUrl}?book_id=${this.bookId}&returned=1&page=${page}`;
      
      this.http.get<any>(url).subscribe({
        next: (response: any) => {
          if (response.status === 'success' && response.data) {
            let rentals = response.data.data || response.data.rentals || response.data;
            let meta = response.data.meta || response.data.pagination || response.meta;
            
            if (Array.isArray(rentals)) {
              // Filtriraj samo vraćene rentals
              const returnedRentals = rentals.filter(r => r.returned_at !== null);
              allRentals = [...allRentals, ...returnedRentals];
            }
            
            if (meta && meta.current_page < meta.last_page) {
              loadPage(page + 1);
            } else {
              this.returnedRentals = allRentals;
              this.pagination.updateTotal(this.returnedRentals.length);
              this.loading = false;
            }
          } else {
            this.returnedRentals = [];
            this.pagination.updateTotal(0);
            this.loading = false;
          }
        },
        error: () => {
          // Fallback na stari način
          this.loadReturnedFallback();
        }
      });
    };

    loadPage(currentPage);
  }

  private loadReturnedFallback(): void {
    this.rentalService.getReturned().subscribe((rentals) => {
      this.returnedRentals = this.bookId
        ? rentals.filter(r => r.book_id === this.bookId)
        : [];
      this.pagination.updateTotal(this.returnedRentals.length);
      this.loading = false;
    });
  }

  getDaysHeld(rental: Rental): number | string {
    if (rental.rented_at && rental.returned_at) {
      const startDate = new Date(rental.rented_at);
      const endDate = new Date(rental.returned_at);
      const diffTime = endDate.getTime() - startDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1; 
    }
    return '';
  }

  getStudentName(id: number): string {
    const student = this.students.find(s => s.id === id);
    return student ? `${student.first_name} ${student.last_name}` : id.toString();
  }

  getLibrarianName(id: number): string {
    const librarian = this.librarians.find(l => l.id === id);
    return librarian ? `${librarian.first_name} ${librarian.last_name}` : id.toString();
  }

  get pagedRentals(): Rental[] {
    return this.pagination.getPageSlice(this.returnedRentals);
  }

  deleteRental(rental: Rental): void {
    if (confirm(`Da li ste sigurni da želite da izbrišete iznajmljivanje #${rental.id}?`)) {
      this.rentalService.deleteRental(rental.id).subscribe(() => {
        this.returnedRentals = this.returnedRentals.filter(r => r.id !== rental.id);
        this.pagination.updateTotal(this.returnedRentals.length);
      });
    }
  }

  getOverdueDays(rental: Rental): number {
    if (rental.rented_at) {
      const start = new Date(rental.rented_at).getTime();
      const now = Date.now();
      const daysHeld = Math.ceil((now - start) / (1000 * 60 * 60 * 24));
      return daysHeld > 30 ? daysHeld - 30 : 0;
    }
    return 0;
  }
}
