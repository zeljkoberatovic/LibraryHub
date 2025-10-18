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

  rentalService = inject(RentalService);
  studentService = inject(StudentService);
  librarianService = inject(LibrarianService);
  pagination = inject(PaginationService);
  private route = inject(ActivatedRoute);

  bookId: number | null = null;

  ngOnInit(): void {
    this.bookId = Number(this.route.parent?.parent?.snapshot.paramMap.get('id'));

    this.rentalService.getReturned().subscribe((rentals) => {
      // Filtriraj samo za ovu knjigu
      this.returnedRentals = this.bookId
        ? rentals.filter(r => r.book_id === this.bookId)
        : [];
      this.pagination.updateTotal(this.returnedRentals.length);
    });

    this.studentService.getAllStudents().subscribe(students => {
      this.students = students;
    });

    this.librarianService.getAllLibrarians().subscribe(librarians => {
      this.librarians = librarians;
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
    this.pagination.updateTotal(this.returnedRentals.length);
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
