import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  template: `
    @if (totalPages > 1) {
<nav class="pagination">
      <button (click)="changePage(currentPage - 1)" [disabled]="currentPage === 1">Prev</button>
      <span>{{currentPage}} / {{totalPages}}</span>
      <button (click)="changePage(currentPage + 1)" [disabled]="currentPage === totalPages">Next</button>
    </nav>
}
  `,
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  @Input() totalPages = 1;
  @Input() currentPage = 1;
  @Output() pageChange = new EventEmitter<number>();

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
