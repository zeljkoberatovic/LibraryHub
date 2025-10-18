import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RentalService } from '@/app/services/rental/rental.service';
import { StudentService } from '@/app/services/student/student.service';
import { LibrarianService } from '@/app/services/librarian/librarian.service';
import { Rental, Librarian, Student } from '@/app/models/rental.model';
import { Router } from '@angular/router';
import { PaginationService } from '@/app/shared/pagination/pagination.service';
import { PaginationComponent } from "@/app/shared/pagination/pagination.component";


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
  }

  loadData(): void {
    this.loading = true;
    this.studentService.getAllStudents().subscribe((users: any[]) => {
      this.students = users as Student[];
      this.librarianService.getAllLibrarians().subscribe((users: any[]) => {
        this.librarians = users as Librarian[];
        this.rentalService.getRentedByBook(this.bookId).subscribe((data: Rental[]) => {
          this.rentedCopies = data.map(rental => ({
            ...rental,
            studentName: this.getStudentName(rental.student_id),
            librarianName: this.getLibrarianName(rental.librarian_id),
            daysHeld: this.calculateDaysHeld(rental.rented_at)
          }));
          this.pagination.reset();
          this.pagination.updateTotal(this.rentedCopies.length);
          this.loading = false;
        });
      });
    });
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