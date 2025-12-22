import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Student as RentalStudent, Book as RentalBook } from '@/app/models/rental.model';
import { StudentService } from '@/app/services/student/student.service';
import { RentalService } from '@/app/services/rental/rental.service';
import { BookService } from '@/app/services/book/book.service';

@Component({
  selector: 'app-issue-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './issue-book.component.html',
  styleUrls: ['./issue-book.component.css']
})
export class IssueBookComponent implements OnInit, OnChanges {
  @Input() book?: RentalBook;

  students: RentalStudent[] = [];
  selectedStudent: RentalStudent | null = null;

  issueDate = '';
  returnDate = '';

  errors: Record<string, string> = {};

  available = 0;
  reserved = 0;
  issued = 0;
  overdue = 0;
  total = 0;

  loading = false;

  private route = inject(ActivatedRoute);
  private studentService = inject(StudentService);
  private rentalService = inject(RentalService);
  private bookService = inject(BookService);
  private router = inject(Router);

  // Ako se promijeni @Input book, inicijalizuj brojače
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['book'] && this.book) {
      this.initBookCounters();
      if (this.book.id) this.refreshBookRentalCounts(this.book.id);
    }
  }

  ngOnInit(): void {
    // Ako nema @Input book, pokušaj pronaći id iz rute i povuci knjigu iz baze
    const foundId = this.findParamId('id');
    if (!this.book && foundId) {
      this.bookService.getBook(foundId).subscribe({
        next: (book) => {
          this.book = book as unknown as RentalBook;
          this.initBookCounters();
          this.refreshBookRentalCounts(foundId);
        }
      });
    }

    // Ako postoji book iz route resolvera, koristi njega
    const routeBook = this.route.snapshot.data['book'] as RentalBook | undefined;
    if (!this.book && routeBook) {
      this.book = routeBook;
      this.initBookCounters();
      if (this.book.id) this.refreshBookRentalCounts(this.book.id);
    }

    // Učitaj sve studente iz baze
    this.studentService.getAllStudents().subscribe({
      next: (users) => {
        this.students = users as unknown as RentalStudent[];
      },
      error: () => {
        this.students = [];
      }
    });
  }

  // Traži parametar u trenutnoj i parent rutama (npr. id knjige)
  private findParamId(key: string): number | null {
    let r: ActivatedRoute | null = this.route;
    while (r) {
      const v = r.snapshot.paramMap.get(key);
      if (v) {
        const n = Number(v);
        if (!isNaN(n)) return n;
      }
      r = (r.parent as ActivatedRoute) ?? null;
    }
    return null;
  }

  // Inicijalizuj brojače na osnovu knjige
  private initBookCounters(): void {
    this.total = this.book?.number_of_copies ?? 0;
    // available će biti izračunat u refreshBookRentalCounts
  }

  // Osveži brojače iznajmljenih i prekoracenih za knjigu
  private refreshBookRentalCounts(bookId: number): void {
    this.rentalService.getRentedByBook(bookId).subscribe({
      next: (rentals: any[]) => {
        // Broji samo iznajmljivanja koja NISU vraćena (returned_at == null)
        const activeRentals = rentals.filter(r => !r.returned_at);
        this.issued = activeRentals.length;
        this.available = Math.max(0, this.total - this.issued);
      }
    });

    this.rentalService.getOverdue().subscribe({
      next: (list) => {
        this.overdue = (list || []).filter(r => r.book_id === bookId).length;
      }
    });
  }

  // Izračunaj datum vraćanja (20 dana od izdavanja)
  calculateReturnDate(): void {
    if (!this.issueDate) {
      this.returnDate = '';
      return;
    }
    const parsed = new Date(this.issueDate);
    if (isNaN(parsed.getTime())) {
      this.returnDate = '';
      return;
    }
    const d = new Date(parsed);
    d.setDate(d.getDate() + 20);
    this.returnDate = d.toISOString().slice(0, 10);
  }

  // Očisti grešku za polje
  clearError(field: string): void {
    delete this.errors[field];
  }

  // Validacija forme
  private validate(): boolean {
    this.errors = {};
    if (!this.selectedStudent) this.errors['student'] = 'Molimo, izaberite učenika.';
    if (!this.issueDate) this.errors['issueDate'] = 'Molimo, unesite datum izdavanja.';
    else {
      const parsed = new Date(this.issueDate);
      if (isNaN(parsed.getTime())) this.errors['issueDate'] = 'Neispravan datum.';
    }
    return Object.keys(this.errors).length === 0;
  }

  // Submit forme: iznajmljivanje knjige i preusmjeravanje na listu izdatih
  submitForm(): void {
    if (!this.validate()) {
      return;
    }

    const bookId = this.book?.id ?? this.findParamId('id');
    if (!bookId) {
      alert('Podaci o knjizi nisu dostupni, učitajte stranicu ponovo.');
      return;
    }
    if (!this.selectedStudent) {
      return;
    }

    const studentId = this.selectedStudent.id;
    // TODO: Zamijeni 14 sa stvarnim ID-jem prijavljenog bibliotekara!
    const librarianId = 14;

    this.loading = true;
    this.rentalService.rentBook(bookId, studentId, librarianId).subscribe({
      next: () => {
        alert('Knjiga je uspješno izdata!');
        this.router.navigate([`/books/view/${bookId}/records/rented`]);
      },
      error: (err) => {
        const serverMessage = err?.error?.message || err?.error || 'Server returned error';
        let details = '';
        if (err?.error?.errors) {
          details = Object.entries(err.error.errors)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
            .join('\n');
        }
        alert(`Greška (${err?.status}): ${serverMessage}${details ? '\n' + details : ''}`);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}