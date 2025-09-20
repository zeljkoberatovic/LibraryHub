import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '@/app/services/settings/category/category.service';
import { Category } from '@/app/models/category.model';
import { PaginationService } from '@/app/shared/pagination/pagination.service';
import { PaginationComponent } from '@/app/shared/pagination/pagination.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoryComponent implements OnInit {
  private categoryService = inject(CategoryService);
  public paginationService = inject(PaginationService);

  categories: Category[] = [];
  displayedCategories: Category[] = [];
  selectedCategory: Category | null = null;
  searchTerm: string = '';
  openMenuIndex: number | null = null;

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(res => {
      this.categories = res.data.data;
      this.applyPagination();
    });
  }

  applyPagination() {
    const filtered = this.filteredCategories;
    this.paginationService.updateTotal(filtered.length);
    this.displayedCategories = this.paginationService.getPageSlice(filtered);
  }

  selectCategory(category: Category) {
    this.selectedCategory = { ...category };
    this.openMenuIndex = null;
  }

  saveCategory(category: Category) {
    if (!category.name) return alert('Naziv je obavezan');

    const action = category.id
      ? this.categoryService.updateCategory(category.id, category)
      : this.categoryService.createCategory(category);

    action.subscribe(() => {
      this.loadCategories();
      this.selectedCategory = null;
    });
  }

  deleteCategory(id: number) {
    if (confirm('Da li ste sigurni da želite da obrišete kategoriju?')) {
      this.categoryService.deleteCategory(id).subscribe(() => {
        this.loadCategories();
        if (this.selectedCategory?.id === id) this.selectedCategory = null;
      });
    }
  }

  cancelEdit() {
    this.selectedCategory = null;
  }

  toggleMenu(index: number) {
    this.openMenuIndex = this.openMenuIndex === index ? null : index;
  }

  editCategory(category: Category) {
    this.selectedCategory = { ...category };
    this.openMenuIndex = null;
  }

  get filteredCategories() {
    if (!this.searchTerm) return this.categories;
    return this.categories.filter(cat =>
      cat.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onPageChange(page: number) {
    this.paginationService.currentPage = page;
    this.applyPagination();
  }
}
