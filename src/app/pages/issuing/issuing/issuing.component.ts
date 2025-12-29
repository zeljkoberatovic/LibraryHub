import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { Rental } from '../../../models/rental.model';
import { RentalService } from '../../../services/rental/rental.service';
import { StudentService } from '../../../services/student/student.service';
import { LibrarianService } from '../../../services/librarian/librarian.service';
import { forkJoin } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-issuing',
  templateUrl: './issuing.component.html',
  styleUrls: ['./issuing.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, RouterLink]
})
export class IssuingComponent implements OnInit {
  activeTab: string = 'issued';
  searchTerm: string = '';

  allIssuedRentals: Rental[] = [];
  allReturnedRentals: Rental[] = [];
  page: number = 1;
  pageSize: number = 12;

  returnedPage: number = 1;
  returnedPageSize: number = 10;
  get hasReturnedDateIssue() {
    // Returns true if any rental has returned_at same as rented_at
    return this.filteredReturnedRentals.some(r => r.returned_at && r.rented_at && r.returned_at === r.rented_at);
  }

  rentalService = inject(RentalService);
  studentService = inject(StudentService);
  librarianService = inject(LibrarianService);

  ngOnInit() {
    this.rentalService.getRented().subscribe(rentals => {
      // Sortiraj od najnovije izdane
      rentals = rentals.sort((a, b) => new Date(b.rented_at).getTime() - new Date(a.rented_at).getTime());
      // Prikupi sve unikatne ID-eve
      const studentIds = Array.from(new Set(rentals.map(r => r.student_id)));
      const librarianIds = Array.from(new Set(rentals.map(r => r.librarian_id)));

      forkJoin({
        students: forkJoin(studentIds.map(id => this.studentService.getStudent(id))),
        librarians: forkJoin(librarianIds.map(id => this.librarianService.getLibrarian(id)))
      }).subscribe(({ students, librarians }) => {
        // Mapiraj po ID-u radi bržeg pristupa
        const studentMap = new Map(students.map(s => [s.id, s]));
        const librarianMap = new Map(librarians.map(l => [l.id, l]));
        // Dodaj podatke svakom rentalu
        this.allIssuedRentals = rentals.map(r => ({
          ...r,
          student: studentMap.get(r.student_id) as any,
          librarian: librarianMap.get(r.librarian_id) as any
        }));
        this.page = 1;
      });
    });

    // Fetch returned rentals
    this.rentalService.getReturned().subscribe(rentals => {
      rentals = rentals.sort((a, b) => new Date(b.returned_at || '').getTime() - new Date(a.returned_at || '').getTime());
      const studentIds = Array.from(new Set(rentals.map(r => r.student_id)));
      const librarianIds = Array.from(new Set(rentals.map(r => r.librarian_id)));
      forkJoin({
        students: forkJoin(studentIds.map(id => this.studentService.getStudent(id))),
        librarians: forkJoin(librarianIds.map(id => this.librarianService.getLibrarian(id)))
      }).subscribe(({ students, librarians }) => {
        const studentMap = new Map(students.map(s => [s.id, s]));
        const librarianMap = new Map(librarians.map(l => [l.id, l]));
        this.allReturnedRentals = rentals.map(r => ({
          ...r,
          student: studentMap.get(r.student_id) as any,
          librarian: librarianMap.get(r.librarian_id) as any
        }));
        this.returnedPage = 1;
      });
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.searchTerm = '';
    this.page = 1;
    this.returnedPage = 1;
  }

  get filteredIssuedRentals() {
    if (!this.searchTerm) return this.allIssuedRentals;
    const term = this.searchTerm.toLowerCase();
    return this.allIssuedRentals.filter(r =>
      r.book?.name.toLowerCase().includes(term) ||
      (r.student?.first_name + ' ' + r.student?.last_name).toLowerCase().includes(term) ||
      (r.librarian?.first_name + ' ' + r.librarian?.last_name).toLowerCase().includes(term)
    );
  }

  get filteredReturnedRentals() {
    if (!this.searchTerm) return this.allReturnedRentals;
    const term = this.searchTerm.toLowerCase();
    return this.allReturnedRentals.filter(r =>
      r.book?.name.toLowerCase().includes(term) ||
      (r.student?.first_name + ' ' + r.student?.last_name).toLowerCase().includes(term) ||
      (r.librarian?.first_name + ' ' + r.librarian?.last_name).toLowerCase().includes(term)
    );
  }

  get pagedIssuedRentals() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredIssuedRentals.slice(start, start + this.pageSize);
  }

  get pagedReturnedRentals() {
    const start = (this.returnedPage - 1) * this.returnedPageSize;
    return this.filteredReturnedRentals.slice(start, start + this.returnedPageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredIssuedRentals.length / this.pageSize) || 1;
  }

  get returnedTotalPages() {
    return Math.ceil(this.filteredReturnedRentals.length / this.returnedPageSize) || 1;
  }

  onPageChange(newPage: number) {
    this.page = newPage;
  }

  onReturnedPageChange(newPage: number) {
    this.returnedPage = newPage;
  }
}