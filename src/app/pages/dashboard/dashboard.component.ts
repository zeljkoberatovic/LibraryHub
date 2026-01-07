import { Component, OnInit } from '@angular/core';
import { RentalService } from '@/app/services/rental/rental.service';
import { StudentService } from '@/app/services/student/student.service';
import { BookService } from '@/app/services/book/book.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [NgxChartsModule]
})
export class DashboardComponent implements OnInit {
  aktivnosti: any[] = [];
  rezervacije: any[] = [];
  statistika = { izdate: 0, rezervisane: 0, prekoracene: 0 };

  chartData = [
    { name: 'Izdate knjige', value: 10 },
    { name: 'Rezervisane knjige', value: 5 },
    { name: 'Prekoračenja', value: 2 }
  ];

  showReservationMessage = false;

  constructor(
    private rentalService: RentalService,
    private studentService: StudentService,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    // Aktivnosti (izdavanja)
    this.rentalService.getRented().subscribe(rentals => {
      this.aktivnosti = rentals.slice(0, 5).map(r => ({
        tip: 'Izdavanje knjige',
        vrijeme: this.getTimeAgo(r.rented_at),
        opis: `${r.librarian?.first_name} ${r.librarian?.last_name} je izdala knjigu <b>${r.book?.name}</b> ${r.student?.first_name} ${r.student?.last_name} dana ${this.formatDate(r.rented_at)}.`
      }));
    });

    // Statistika
    this.rentalService.getRentalSummary().subscribe(summary => {
      this.statistika.izdate = summary.issuedCount;
      this.statistika.rezervisane = summary.reservedCount;
      this.statistika.prekoracene = summary.overdueCount;
    });
  }

  getTimeAgo(date: string): string {
    // Vrati string tipa "prije 4 dana" ili "prije 2 mjeseca"
    // ...implementacija...
    return '';
  }

  formatDate(date: string): string {
    // Formatiraj datum u "dd.MM.yyyy"
    // ...implementacija...
    return '';
  }

  onShowAllReservations() {
    this.showReservationMessage = true;
    setTimeout(() => {
      this.showReservationMessage = false;
    }, 5000);
  }
}