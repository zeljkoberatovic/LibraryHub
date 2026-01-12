import { Component, OnInit, inject } from '@angular/core';
import { RentalService } from '@/app/services/rental/rental.service';
import { StudentService } from '@/app/services/student/student.service';
import { BookService } from '@/app/services/book/book.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LibrarianService } from '@/app/services/librarian/librarian.service';
import { Rental } from '@/app/models/rental.model';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [NgxChartsModule]
})
export class DashboardComponent implements OnInit {
  aktivnosti: {
    bookName: string;
    studentName: string;
    librarianName: string;
    rented_at: string;
  }[] = [];
  statistika = { izdate: 0, rezervisane: 0, prekoracene: 0 };

  chartData = [
    { name: 'Izdate knjige', value: 10 },
    { name: 'Rezervisane knjige', value: 5 },
    { name: 'Prekoračenja', value: 2 }
  ];

  showReservationMessage = false;

  aktivnostiLoading = false; 
  aktivnostiPerPage = 6;
  prikazaneAktivnosti = 6;

  private rentalService = inject(RentalService);
  private studentService = inject(StudentService);
  private bookService = inject(BookService);
  private librarianService = inject(LibrarianService);

  ngOnInit(): void {
    this.aktivnostiLoading = true; // start loading
    this.rentalService.getRented().subscribe(rentals => {
      this.studentService.getAllStudents().subscribe(students => {
        this.librarianService.getAllLibrarians().subscribe(librarians => {
          const studentMap = new Map<number, any>();
          students.forEach(s => {
            if (typeof s.id === 'number') {
              studentMap.set(s.id, s);
            }
          });
          const librarianMap = new Map<number, any>();
          librarians.forEach(l => {
            if (typeof l.id === 'number') {
              librarianMap.set(l.id, l);
            }
          });
          this.aktivnosti = rentals.map((r: Rental) => ({
            bookName: r.book?.name || 'Nepoznata knjiga',
            studentName: studentMap.has(r.student_id)
              ? `${studentMap.get(r.student_id).first_name} ${studentMap.get(r.student_id).last_name}`
              : 'Nepoznat učenik',
            librarianName: librarianMap.has(r.librarian_id)
              ? `${librarianMap.get(r.librarian_id).first_name} ${librarianMap.get(r.librarian_id).last_name}`
              : 'Nepoznat bibliotekar',
            rented_at: r.rented_at
          }));
          this.aktivnostiLoading = false; // end loading
        });
      });
    });

    // Statistika
    this.rentalService.getRentalSummary().subscribe(summary => {
      this.statistika.izdate = summary.issuedCount;
      this.statistika.rezervisane = summary.reservedCount;
      this.statistika.prekoracene = summary.overdueCount;
      // ažuriraj chartData ako želiš da bude dinamičan
      this.chartData = [
        { name: 'Izdate knjige', value: summary.issuedCount },
        { name: 'Rezervisane knjige', value: summary.reservedCount },
        { name: 'Prekoračenja', value: summary.overdueCount }
      ];
    });
  }

  onShowAllReservations() {
    this.showReservationMessage = true;
    setTimeout(() => {
      this.showReservationMessage = false;
    }, 5000);
  }

  showMoreAktivnosti() {
    this.prikazaneAktivnosti += this.aktivnostiPerPage;
  }
}