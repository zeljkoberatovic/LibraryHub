// ...existing code...
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface Student {
  id?: number;
  name: string;
}

interface Book {
  id?: number;
  name?: string;
  number_of_copies?: number;
  available?: number;
  reserved?: number;
  issued?: number;
  overdue?: number;
  isbn?: string;
}

@Component({
  selector: 'app-issue-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './issue-book.component.html',
  styleUrls: ['./issue-book.component.css']
})
export class IssueBookComponent implements OnInit {
  @Input() book?: Book;

  students: Student[] = [
    { id: 1, name: 'Pero Perović' },
    { id: 2, name: 'Ana Anić' },
    { id: 3, name: 'Marko Markić' }
  ];

  selectedStudent: Student | null = null;
  issueDate = '';
  returnDate = '';
  errors: Record<string, string> = {};

  // counts shown in the right card
  available = 0;
  reserved = 0;
  issued = 0;
  overdue = 0;
  total = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // try to get book from resolver route data if @Input not provided
    const routeBook = this.route.snapshot.data['book'] as Book | undefined;
    if (!this.book && routeBook) {
      this.book = routeBook;
    }

    if (this.book) {
      this.total = this.book.number_of_copies ?? 0;
      this.available = this.book.available ?? Math.max(0, this.total - (this.book.issued ?? 0) - (this.book.reserved ?? 0));
      this.reserved = this.book.reserved ?? 0;
      this.issued = this.book.issued ?? 0;
      this.overdue = this.book.overdue ?? 0;
    }
  }

  calculateReturnDate(): void {
    if (!this.issueDate) {
      this.returnDate = '';
      return;
    }
    const d = new Date(this.issueDate);
    d.setDate(d.getDate() + 20); // 20-day loan period
    this.returnDate = d.toISOString().split('T')[0];
  }

  clearError(field: string): void {
    delete this.errors[field];
  }

  private validate(): boolean {
    this.errors = {};
    if (!this.selectedStudent) this.errors['student'] = 'Please select a student.';
    if (!this.issueDate) this.errors['issueDate'] = 'Please enter an issue date.';
    return Object.keys(this.errors).length === 0;
  }

  submitForm(): void {
    if (!this.validate()) return;

    // TODO: pozvati servis za izdavanje knjige (HTTP call)
    const studentName = this.selectedStudent?.name ?? 'Unknown';
    alert(`Book "${this.book?.name ?? '—'}" issued to ${studentName} until ${this.returnDate}`);

    // lokalno ažuriranje brojača (privremeno)
    this.issued += 1;
    if (this.available > 0) this.available -= 1;
  }
}
// ...existing code...