import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RentalService } from '@/app/services/rental/rental.service';
import { StudentService } from '@/app/services/student/student.service';
import { LibrarianService } from '@/app/services/librarian/librarian.service';
import { Rental } from '@/app/models/rental.model';
import { User } from '@/app/models/user.model';

@Component({
  selector: 'app-overdue',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overdue.component.html',
  styleUrls: ['./overdue.component.css']
})
export class OverdueComponent implements OnInit {
  overdueRentals: Rental[] = [];
  students: User[] = [];
  librarians: User[] = [];

  private rentalService = inject(RentalService);
  private studentService = inject(StudentService);
  private librarianService = inject(LibrarianService);

  ngOnInit(): void {
    this.loadOverdueRentals();
    this.studentService.getAllStudents().subscribe(students => {
      this.students = students;
    });
    this.librarianService.getAllLibrarians().subscribe(librarians => {
      this.librarians = librarians;
    });
  }

  private loadOverdueRentals(): void {
    this.rentalService.getOverdue().subscribe(rentals => {
      this.overdueRentals = rentals;
    });
  }

  getStudentName(id: number): string {
    const student = this.students.find(s => s.id === id);
    return student ? `${student.first_name} ${student.last_name}` : id.toString();
  }

  getLibrarianName(id: number): string {
    const librarian = this.librarians.find(l => l.id === id);
    return librarian ? `${librarian.first_name} ${librarian.last_name}` : id.toString();
  }

  getDaysHeld(rental: Rental): number | string {
    if (rental.rented_at) {
      const start = new Date(rental.rented_at).getTime();
      const end = rental.returned_at
        ? new Date(rental.returned_at).getTime()
        : Date.now();
      return Math.floor((end - start) / (1000 * 60 * 60 * 24));
    }
    return '';
  }

  getOverdueDays(rental: Rental): number | string {
    if (rental.rented_at) {
      const start = new Date(rental.rented_at).getTime();
      const now = Date.now();
      const daysHeld = Math.floor((now - start) / (1000 * 60 * 60 * 24));
      // Sve preko 30 dana je prekoracenje
      return daysHeld > 30 ? daysHeld - 30 : 0;
    }
    return '';
  }
}
