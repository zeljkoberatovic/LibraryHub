import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Book } from '../../../models/book.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-book',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, CommonModule],
  templateUrl: './view-book.component.html',
  styleUrls: ['./view-book.component.css'],
})
export class ViewBook implements OnInit {
  book: Book | null = null;
  dropdownOpen = false;

  private route = inject(ActivatedRoute);
  rentalId: any|string;
currentRentalId: any|string;
rentedCopies: any;

  ngOnInit(): void {
    this.route.data.subscribe(({ book }) => {
      this.book = book;
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }
}
