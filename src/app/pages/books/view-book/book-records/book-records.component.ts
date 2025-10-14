import { Component, inject, OnInit } from '@angular/core';

import { ActivatedRoute, RouterModule } from '@angular/router';
import { RentalService } from 'src/app/services/rental/rental.service';

@Component({
  selector: 'app-book-records',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './book-records.component.html',
  styleUrls: ['./book-records.component.css'],
})
export class BookRecords implements OnInit {
  private route = inject(ActivatedRoute);
  private rentalService = inject(RentalService);

  bookId!: number;
  summary: any;

  ngOnInit(): void {
   
  }
}
