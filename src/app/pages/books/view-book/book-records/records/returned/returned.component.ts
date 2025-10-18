import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RentalService } from '@/app/services/rental/rental.service';
import { StudentService } from '@/app/services/student/student.service';
import { LibrarianService } from '@/app/services/librarian/librarian.service';
import { Rental } from '@/app/models/rental.model';
import { User } from '@/app/models/user.model';
import { PaginationService } from '@/app/shared/pagination/pagination.service';
import { PaginationComponent } from "@/app/shared/pagination/pagination.component";

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

  ngOnInit(): void {
    this.rentalService.getReturned().subscribe((rentals) => {
      this.returnedRentals = rentals;
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
      const start = new Date(rental.rented_at).getTime();
      const end = new Date(rental.returned_at).getTime();
      return Math.floor((end - start) / (1000 * 60 * 60 * 24));
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
}
