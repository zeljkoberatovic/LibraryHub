import { Component, OnInit, inject } from '@angular/core';
import { RentalService } from '@/app/services/rental/rental.service';
import { StudentService } from '@/app/services/student/student.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reserve-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reserve-book.component.html',
  styleUrl: './reserve-book.component.css'
})
export class ReserveBookComponent implements OnInit {
  students: any[] = [];
  selectedStudentId: number | null = null;
  reservationDate: string = '';
  bookId: number | null = null;
  successMessage: string = '';
  errorMessage: string = '';

  rentalService = inject(RentalService);
  studentService = inject(StudentService);
  route = inject(ActivatedRoute);

  ngOnInit() {
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    this.studentService.getAllStudents().subscribe(students => {
      this.students = students;
    });
  }

  reserve() {
    this.successMessage = '';
    this.errorMessage = '';
    // Ovdje simuliramo da rezervacija nije moguća
    this.errorMessage = 'Trenutno nije moguće izvršiti rezervaciju.';
  }
}
