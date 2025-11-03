import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RentalService } from '@/app/services/rental/rental.service';
import { Rental } from '@/app/models/rental.model';
import { StudentService } from '@/app/services/student/student.service';
import { LibrarianService } from '@/app/services/librarian/librarian.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Component({
  selector: 'app-view-details',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.css']
})
export class ViewDetailsComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  rentalService = inject(RentalService);
  studentService = inject(StudentService);
  librarianService = inject(LibrarianService);
  http = inject(HttpClient);

  rental?: Rental;
  actionDate?: Date;
  daysHeld?: number;
  isOverdue?: boolean;
  librarianName?: string;
  studentName?: string;
  errorMsg: string | null = null;
  loading = true;
  bookId!: number;
  rentalId!: number;

  ngOnInit() {
    this.rentalId = Number(this.route.snapshot.paramMap.get('rentalId'));
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.rentalId) {
      this.errorMsg = 'ID iznajmljivanja nije pronađen u ruti.';
      this.loading = false;
      return;
    }

    this.loadFromAllRentals(this.rentalId, this.bookId);
  }

  private loadFromAllRentals(rentalId: number, bookId: number): void {
    let allRentals: Rental[] = [];
    let currentPage = 1;
    const baseUrl = `${environment.apiUrl}/rentals`;

    const loadPage = (page: number) => {
      const url = `${baseUrl}?book_id=${bookId}&page=${page}`;

      this.http.get<any>(url).subscribe({
        next: (response: any) => {
          if (response.status === 'success' && response.data) {
            let rentals = response.data.data || response.data.rentals || response.data;
            let meta = response.data.meta || response.data.pagination || response.meta;

            if (Array.isArray(rentals)) {
              allRentals = [...allRentals, ...rentals];
              const foundRental = allRentals.find(r => r.id === rentalId);
              if (foundRental) {
                this.processRental(foundRental);
                return;
              }
            } else if (typeof response.data === 'object' && !Array.isArray(response.data)) {
              for (const key of Object.keys(response.data)) {
                if (Array.isArray(response.data[key])) {
                  allRentals = [...allRentals, ...response.data[key]];
                  const foundRental = allRentals.find(r => r.id === rentalId);
                  if (foundRental) {
                    this.processRental(foundRental);
                    return;
                  }
                  break;
                }
              }
            }

            if (meta && meta.current_page < meta.last_page) {
              loadPage(page + 1);
            } else {
              const rental = allRentals.find(r => r.id === rentalId);
              if (rental) {
                this.processRental(rental);
              } else {
                this.errorMsg = `Iznajmljivanje sa ID ${rentalId} nije pronađeno za knjigu ${bookId}.`;
                this.loading = false;
              }
            }
          } else {
            this.errorMsg = 'Greška pri dohvaćanju podataka.';
            this.loading = false;
          }
        },
        error: () => {
          this.errorMsg = 'Greška pri dohvaćanju podataka o iznajmljivanju.';
          this.loading = false;
        }
      });
    };

    loadPage(currentPage);
  }

  private processRental(rental: Rental): void {
    this.rental = rental;
    this.actionDate = rental.rented_at ? new Date(rental.rented_at) : undefined;
    this.daysHeld = this.calculateDaysHeld(rental.rented_at);
    const allowedDays = 30;
    this.isOverdue = rental.active_days_of_rental !== undefined ? rental.active_days_of_rental > allowedDays : false;

    if (rental.librarian_id) {
      this.librarianService.getLibrarian(rental.librarian_id).subscribe({
        next: (lib) => {
          this.librarianName = lib ? `${lib.first_name} ${lib.last_name}` : `ID: ${rental.librarian_id}`;
        },
        error: () => {
          this.librarianName = `ID: ${rental.librarian_id}`;
        }
      });
    } else {
      this.librarianName = 'Nepoznato';
    }

    if (rental.student_id) {
      this.studentService.getStudent(rental.student_id).subscribe({
        next: (stu) => {
          this.studentName = stu ? `${stu.first_name} ${stu.last_name}` : `ID: ${rental.student_id}`;
        },
        error: () => {
          this.studentName = `ID: ${rental.student_id}`;
        }
      });
    } else {
      this.studentName = 'Nepoznato';
    }

    this.loading = false;
  }

  calculateDaysHeld(rentedDate?: string | Date): number {
    if (!rentedDate) return 0;
    const today = new Date();
    const rented = new Date(rentedDate);
    return Math.max(0, Math.floor((today.getTime() - rented.getTime()) / (1000 * 60 * 60 * 24)));
  }

  goBack(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}