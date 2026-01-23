import { Component, OnInit, inject } from '@angular/core';
import { RentalService } from '@/app/services/rental/rental.service';
import { StudentService } from '@/app/services/student/student.service';
import { BookService } from '@/app/services/book/book.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LibrarianService } from '@/app/services/librarian/librarian.service';
import { Rental } from '@/app/models/rental.model';
import { ActivatedRoute } from '@angular/router';
import { DashboardData } from '@/app/resolvers/dashboard/dashboard.resolver';

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

  statistics = { issued: 0, returned: 0, overdue: 0 };
  chartData = [
    { name: 'Izdate knjige', value: 0 },
    { name: 'Vraćene knjige', value: 0 },
    { name: 'Prekoračene knjige', value: 0 }
  ];
  notifications: Array<{ message: string; date: Date }> = [];

  showReservationMessage = false;

  aktivnostiLoading = false;
  aktivnostiPerPage = 6;
  prikazaneAktivnosti = 6;

  private rentalService = inject(RentalService);
  private studentService = inject(StudentService);
  private bookService = inject(BookService);
  private librarianService = inject(LibrarianService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    // Preuzima podatke iz resolvera
    const data = this.route.snapshot.data['data'] as DashboardData | null;
    if (data) {
      this.statistics = {
        issued: data.stats.rentals,
        returned: data.stats.rentals, 
        overdue: 0 
      };
      this.chartData = [
        { name: 'Izdate knjige', value: data.stats.rentals },
        { name: 'Vraćene knjige', value: data.stats.rentals }, 
        { name: 'Prekoračene knjige', value: 0 } 
      ];
      this.notifications = data.notifications;
      
     // console.log('STATISTICS from resolver:', this.statistics);
      //console.log('NOTIFICATIONS from resolver:', this.notifications);
    }
    this.aktivnostiLoading = true;
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
          this.aktivnostiLoading = false;
        });
      });
    });
  }

  trackByRentedAt(index: number, item: any): string {
    return item.rented_at;
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