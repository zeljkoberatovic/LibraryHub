import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '@/app/services/student/student.service';
import { RentalService } from '@/app/services/rental/rental.service';
import { BookService } from '@/app/services/book/book.service';

@Component({
  selector: 'app-reserve-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reserve-book.component.html',
  styleUrls: ['./reserve-book.component.css']
})
export class ReserveBookComponent implements OnInit {
  students: any[] = [];
  selectedStudentId: any = null;
  reservationDate = '';
  successMessage: string = '';
  errorMessage: string = '';
  loading = false;

  private route = inject(ActivatedRoute);
  private studentService = inject(StudentService);
  private rentalService = inject(RentalService);
  private bookService = inject(BookService);
  private router = inject(Router);

  bookId: number | null = null;
  librarianId: number = 38; // Zamijeniti kasnije sa stvarnim ID-jem iz autentifikacije

  ngOnInit(): void {
    this.bookId = Number(this.route.parent?.snapshot.paramMap.get('id'));
    this.studentService.getAllStudents().subscribe({
      next: (users) => {
        this.students = users;
      },
      error: () => {
        this.students = [];
      }
    });
  }

  reserve(): void {
    this.successMessage = '';
    this.errorMessage = '';

    //console.log('bookId:', this.bookId);
    //console.log('selectedStudentId:', this.selectedStudentId);
    //console.log('reservationDate:', this.reservationDate);

    const studentId = Number(this.selectedStudentId);

    if (!this.bookId || !studentId || !this.reservationDate.trim()) {
      this.errorMessage = 'Popunite sva polja.';
      return;
    }

    this.rentalService.reserveBook(this.bookId, studentId, this.librarianId, this.reservationDate).subscribe({
      next: () => {
        this.successMessage = 'Rezervacija je uspješna.';
        this.errorMessage = '';
        this.selectedStudentId = null;
        this.reservationDate = '';
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Greška pri rezervaciji.';
      }
    });
  }
}
