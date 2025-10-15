import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Reservation } from '@/app/models/rental.model';



@Component({
  selector: 'app-active-res',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './active-res.component.html',
  styleUrls: ['./active-res.component.css']
  
})
export class ActiveResComponent {
  activeReservations: Reservation[] = [
    {
      id: 1,
      reservationDate: '2025-10-01',
      expiryDate: '2025-10-15',
      submittedBy: 'Marko Marković',
      status: null
    },
    {
      id: 2,
      reservationDate: '2025-10-05',
      expiryDate: '2025-10-20',
      submittedBy: 'Ana Jovanović',
      status: null
    }
  ];

  openedMenuId: number | null = null;

  toggleMenu(id: number) {
    this.openedMenuId = this.openedMenuId === id ? null : id;
  }

  setStatus(id: number, status: 'reserved' | 'rejected') {
    const res = this.activeReservations.find(r => r.id === id);
    if (res) res.status = status;
    this.openedMenuId = null;
  }

  issueBook(id: number) {
    console.log('Izdaj knjigu', id);
  }

  cancelReservation(id: number) {
    console.log('Otkaži rezervaciju', id);
  }
}
