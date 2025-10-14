import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overdue',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overdue.component.html',
  styleUrls: ['./overdue.component.css']
})
export class OverdueComponent {
  overdueRentals = [
    {
      id: 1,
      student: 'Marko Jovanović',
      issueDate: new Date('2025-09-01'),
      overdueDays: 12,
      daysHeld: 30,
      issuedBy: 'Ana Petrović'
    },
    {
      id: 2,
      student: 'Milica Ilić',
      issueDate: new Date('2025-08-25'),
      overdueDays: 20,
      daysHeld: 45,
      issuedBy: 'Petar Lukić'
    },
    {
      id: 3,
      student: 'Nikola Stojanov',
      issueDate: new Date('2025-09-10'),
      overdueDays: 5,
      daysHeld: 15,
      issuedBy: 'Jelena Marić'
    }
  ];

  openedMenuId: number | null = null;

  toggleMenu(id: number): void {
    this.openedMenuId = this.openedMenuId === id ? null : id;
  }

  closeMenu(): void {
    this.openedMenuId = null;
  }

  viewDetails(id: number): void {
    console.log('Detalji za iznajmljivanje ID:', id);
    this.closeMenu();
  }

  rentBook(id: number): void {
    console.log('Izdaj knjigu ID:', id);
    this.closeMenu();
  }

  returnBook(id: number): void {
    console.log('Vrati knjigu ID:', id);
    this.closeMenu();
  }

  reserveBook(id: number): void {
    console.log('Rezerviši knjigu ID:', id);
    this.closeMenu();
  }

  discardBook(id: number): void {
    console.log('Otpisi knjigu ID:', id);
    this.closeMenu();
  }

  deleteBook(id: number): void {
    console.log('Izbriši knjigu ID:', id);
    this.closeMenu();
  }
}
