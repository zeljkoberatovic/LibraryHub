import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-returned',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './returned.component.html',
  styleUrls: ['./returned.component.css']
})
export class ReturnedComponent {
  returnedRentals = [
    {
      id: 1,
      student: 'Marko Jovanović',
      issueDate: new Date('2025-09-01'),
      returnDate: new Date('2025-09-15'),
      daysHeld: 14,
      receivedBy: 'Ana Petrović'
    },
    {
      id: 2,
      student: 'Milica Ilić',
      issueDate: new Date('2025-08-20'),
      returnDate: new Date('2025-09-05'),
      daysHeld: 16,
      receivedBy: 'Petar Lukić'
    },
    {
      id: 3,
      student: 'Nikola Stojanov',
      issueDate: new Date('2025-09-05'),
      returnDate: new Date('2025-09-20'),
      daysHeld: 15,
      receivedBy: 'Jelena Marić'
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
    console.log('Otpiši knjigu ID:', id);
    this.closeMenu();
  }

  deleteBook(id: number): void {
    console.log('Izbriši knjigu ID:', id);
    this.closeMenu();
  }
}
