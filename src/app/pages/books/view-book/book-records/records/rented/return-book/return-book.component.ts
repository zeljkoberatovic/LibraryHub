import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RentalService } from '@/app/services/rental/rental.service';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '@/app/services/student/student.service';
import { LibrarianService } from '@/app/services/librarian/librarian.service';
import { Rental } from '@/app/models/rental.model';

@Component({
  selector: 'app-return-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './return-book.component.html',
  styleUrls: ['./return-book.component.css']
})
export class ReturnBookComponent implements OnInit {
  rentedCopies: any[] = [];
  bookId?: number;

  rentalService = inject(RentalService);
  route = inject(ActivatedRoute);
  studentService = inject(StudentService);
  librarianService = inject(LibrarianService);

  ngOnInit() {
    this.bookId = Number(this.route.parent?.parent?.snapshot.paramMap.get('id'));
    if (this.bookId) {
      this.rentalService.getRentedByBook(this.bookId).subscribe({
        next: (copies: Rental[]) => {
          this.rentedCopies = copies.map(copy => ({
            ...copy,
            selected: false,
            studentName: '',
            librarianName: ''
          }));
          this.rentedCopies.forEach(copy => {
            if (copy.student_id) {
              this.studentService.getStudent(copy.student_id).subscribe(stu => {
                copy.studentName = stu ? `${stu.first_name} ${stu.last_name}` : `ID: ${copy.student_id}`;
              });
            }
            if (copy.librarian_id) {
              this.librarianService.getLibrarian(copy.librarian_id).subscribe(lib => {
                copy.librarianName = lib ? `${lib.first_name} ${lib.last_name}` : `ID: ${copy.librarian_id}`;
              });
            }
          });
        },
        error: () => {
          this.rentedCopies = [];
        }
      });
    }
  }

  cancel() {
    this.rentedCopies.forEach(copy => copy.selected = false);
  }

  returnBook() {
    const selectedIds = this.rentedCopies.filter(c => c.selected).map(c => c.id);
    if (selectedIds.length === 0) {
      alert('Niste odabrali nijednu knjigu za vraćanje.');
      return;
    }
    // rentalService.returnBook(selectedIds).subscribe(...)
    alert('Vraćanje knjiga je spremno za backend!');
  }
  calculateDaysHeld(rentedDate?: string | Date): number {
    if (!rentedDate) return 0;
    const today = new Date();
    const rented = new Date(rentedDate);
    return Math.max(0, Math.floor((today.getTime() - rented.getTime()) / (1000 * 60 * 60 * 24)));
  }
}