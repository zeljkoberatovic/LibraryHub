import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PaginationService {
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;

  reset() {
    this.currentPage = 1;
    this.totalPages = 1;
  }

  updateTotal(itemsCount: number): void {
    this.totalPages = Math.ceil(itemsCount / this.itemsPerPage) || 1;
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }

  getPageSlice<T>(items: T[]): T[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return items.slice(start, start + this.itemsPerPage);
  }
}
