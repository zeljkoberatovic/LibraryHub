import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rented',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rented.component.html',
  styleUrls: ['./rented.component.css']
})
export class RentedComponent {
  rentedCopies = [
    {
      id: 1,
      student: 'Marko Jovanović',
      issueDate: new Date('2025-10-01'),
      daysHeld: 13,
      issuedBy: 'Ana Petrović'
    },
    {
      id: 2,
      student: 'Milica Ilić',
      issueDate: new Date('2025-10-05'),
      daysHeld: 9,
      issuedBy: 'Petar Lukić'
    },
    {
      id: 3,
      student: 'Nikola Stojanov',
      issueDate: new Date('2025-09-29'),
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

  markAsLost(id: number): void {
    console.log('Otpis knjige ID:', id);
    this.closeMenu();
  }

  returnBook(id: number): void {
    console.log('Vraćanje knjige ID:', id);
    this.closeMenu();
  }
}
