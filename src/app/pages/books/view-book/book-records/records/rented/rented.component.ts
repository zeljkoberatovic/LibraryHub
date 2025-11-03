import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { RentalService } from '@/app/services/rental/rental.service';
import { StudentService } from '@/app/services/student/student.service';
import { LibrarianService } from '@/app/services/librarian/librarian.service';
import { Rental, Librarian, Student } from '@/app/models/rental.model';
import { PaginationService } from '@/app/shared/pagination/pagination.service';
import { PaginationComponent } from "@/app/shared/pagination/pagination.component";
import { HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { environment } from '@/environments/environment';

@Component({
  selector: 'app-rented',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './rented.component.html',
  styleUrls: ['./rented.component.css']
})
export class RentedComponent implements OnInit {
  rentalService = inject(RentalService);
  studentService = inject(StudentService);
  librarianService = inject(LibrarianService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  pagination = inject(PaginationService);
  http = inject(HttpClient);

  rentedCopies: (Rental & { studentName: string; librarianName: string; daysHeld: number })[] = [];
  students: Student[] = [];
  librarians: Librarian[] = [];
  openedMenuId: number | null = null;
  bookId!: number;
  loading = true;

  ngOnInit(): void {
    this.route.parent?.parent?.paramMap.subscribe(params => {
      this.bookId = Number(params.get('id'));
      this.loadData();
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const currentUrl = event.url;
      const rentedPagePattern = `/books/view/${this.bookId}/records/rented`;
      if (currentUrl === rentedPagePattern) {
        setTimeout(() => {
          this.loadData();
        }, 500);
      }
    });
  }

  loadData(): void {
    this.loading = true;
    this.studentService.getAllStudents().subscribe((users: any[]) => {
      this.students = users as Student[];
      this.librarianService.getAllLibrarians().subscribe((users: any[]) => {
        this.librarians = users as Librarian[];
        this.loadAllRentedCopies();
      });
    });
  }

  private loadAllRentedCopies(): void {
    let allRentals: Rental[] = [];
    let currentPage = 1;
    const baseUrl = `${environment.apiUrl}/rentals`;

    const loadPage = (page: number) => {
      const url = `${baseUrl}?book_id=${this.bookId}&page=${page}`;
      this.http.get<any>(url).subscribe({
        next: (response: any) => {
          if (response.status === 'success' && response.data) {
            let rentals = response.data.data || response.data.rentals || response.data;
            let meta = response.data.meta || response.data.pagination || response.meta;

            if (Array.isArray(rentals)) {
              const activeRentals = rentals.filter(rental =>
                rental.returned_at === null ||
                rental.returned_at === undefined ||
                rental.returned_at === '' ||
                rental.returned_at === '0000-00-00 00:00:00'
              );
              allRentals = [...allRentals, ...activeRentals];
            } else if (typeof response.data === 'object' && !Array.isArray(response.data)) {
              for (const key of Object.keys(response.data)) {
                if (Array.isArray(response.data[key])) {
                  const activeRentals = response.data[key].filter(rental =>
                    rental.returned_at === null ||
                    rental.returned_at === undefined ||
                    rental.returned_at === '' ||
                    rental.returned_at === '0000-00-00 00:00:00'
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
          if (page === 1) {
            this.processRentals([]);
          } else {
            this.processRentals(allRentals);
          }
        }
      });
    };

    loadPage(currentPage);
  }

  private processRentals(rentals: Rental[]): void {
    this.rentedCopies = rentals.map(rental => ({
      ...rental,
      studentName: this.getStudentName(rental.student_id),
      librarianName: this.getLibrarianName(rental.librarian_id),
      daysHeld: this.calculateDaysHeld(rental.rented_at)
    }));

    this.pagination.reset();
    this.pagination.updateTotal(this.rentedCopies.length);
    this.loading = false;
  }

  getStudentName(studentId: number): string {
    const student = this.students.find(s => s.id === studentId);
    return student ? `${student.first_name} ${student.last_name}` : 'Nepoznat učenik';
  }

  getLibrarianName(librarianId: number): string {
    const librarian = this.librarians.find(l => l.id === librarianId);
    return librarian ? `${librarian.first_name} ${librarian.last_name}` : 'Nepoznat bibliotekar';
  }

  calculateDaysHeld(rentedDate: string | Date): number {
    const today = new Date();
    const rented = new Date(rentedDate);
    return Math.floor((today.getTime() - rented.getTime()) / (1000 * 60 * 60 * 24));
  }

  toggleMenu(id: number): void {
    this.openedMenuId = this.openedMenuId === id ? null : id;
  }

  closeMenu(): void {
    this.openedMenuId = null;
  }

  viewDetails(id: number): void {
    this.router.navigate(['books', 'view', this.bookId, 'records', 'rented', id, 'details']);
    this.closeMenu();
  }

  markAsLost(id: number): void {
    this.router.navigate(['books', 'view', this.bookId, 'records', 'rented', id, 'lost']);
    this.closeMenu();
  }

  returnBook(id: number): void {
    this.router.navigate(['books', 'view', this.bookId, 'records', 'rented', id, 'return']);
    this.closeMenu();
  }

  get pagedRentedCopies() {
    return this.pagination.getPageSlice(this.rentedCopies);
  }
}