import { Component } from '@angular/core';
import { ArchivedReservation } from '@/app/models/rental.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-archived-res',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './archived-res.component.html',
  styleUrls: ['./archived-res.component.css']
})
export class ArchivedResComponent {
  archivedReservations: ArchivedReservation[] = [
    {
      id: 1,
      reservationDate: '2025-09-20',
      expiryDate: '2025-10-05',
      submittedBy: 'Nikola Nikolić',
      status: 'book-issued'
    },
    {
      id: 2,
      reservationDate: '2025-09-10',
      expiryDate: '2025-09-25',
      submittedBy: 'Ivana Ilić',
      status: 'expired'
    }
  ];

  openedMenuId: number | null = null;

  toggleMenu(id: number) {
    this.openedMenuId = this.openedMenuId === id ? null : id;
  }

  issueBook(id: number) {
    console.log('Izdaj knjigu za rezervaciju', id);
  }
}
