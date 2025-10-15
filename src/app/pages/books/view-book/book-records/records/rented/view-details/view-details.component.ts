import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RentalService } from '@/app/services/rental/rental.service';
import { Rental } from '@/app/models/rental.model';
import { StudentService } from '@/app/services/student/student.service';
import { LibrarianService } from '@/app/services/librarian/librarian.service';

@Component({
  selector: 'app-view-details',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.css']
})
export class ViewDetailsComponent implements OnInit {
  route = inject(ActivatedRoute);
  rentalService = inject(RentalService);
  studentService = inject(StudentService);
  librarianService = inject(LibrarianService);

  actionDate?: Date;
  daysHeld?: number;
  isOverdue?: boolean;
  librarianName?: string;
  studentName?: string;
  errorMsg: string | null = null;
  loading = true;

  ngOnInit() {
    const rentalId = Number(this.route.snapshot.paramMap.get('rentalId'));
    if (!rentalId) {
      this.errorMsg = 'ID iznajmljivanja nije pronađen u ruti.';
      this.loading = false;
      return;
    }

    this.rentalService.getRentalById(rentalId).subscribe({
      next: (rental: Rental | undefined) => {
        if (!rental) {
          this.errorMsg = 'Iznajmljivanje nije pronađeno.';
          this.loading = false;
          return;
        }
        this.actionDate = rental.rented_at ? new Date(rental.rented_at) : undefined;
        this.daysHeld = this.calculateDaysHeld(rental.rented_at);
        const allowedDays = 30;
        this.isOverdue = rental.active_days_of_rental !== undefined ? rental.active_days_of_rental > allowedDays : false;

        // Dohvati bibliotekara po ID-u
        if (rental.librarian_id) {
          this.librarianService.getLibrarian(rental.librarian_id).subscribe(lib => {
            this.librarianName = lib ? `${lib.first_name} ${lib.last_name}` : `ID: ${rental.librarian_id}`;
          });
        } else {
          this.librarianName = 'Nepoznato';
        }

        // Dohvati studenta po ID-u
        if (rental.student_id) {
          this.studentService.getStudent(rental.student_id).subscribe(stu => {
            this.studentName = stu ? `${stu.first_name} ${stu.last_name}` : `ID: ${rental.student_id}`;
          });
        } else {
          this.studentName = 'Nepoznato';
        }

        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Greška pri dohvaćanju podataka o iznajmljivanju. Pokušajte ponovo kasnije.';
        this.loading = false;
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