import { Component, OnInit, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CategoryService } from '@/app/services/settings/category/category.service';
import { Category } from '@/app/models/category.model';
import { PaginationService } from '@/app/shared/pagination/pagination.service';
import { PaginationComponent } from '@/app/shared/pagination/pagination.component';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [FormsModule, PaginationComponent, MatSnackBarModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoryComponent implements OnInit {
  private categoryService = inject(CategoryService);
  public paginationService = inject(PaginationService);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  categories: Category[] = [];
  displayedCategories: Category[] = [];
  selectedCategory: Category | null = null;
  searchTerm: string = '';
  openMenuIndex: number | null = null;

  ngOnInit(): void {
    this.categories = this.route.snapshot.data['categories'].data.data;
    this.applyPagination();
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
    if (!category.name?.trim()) return alert('Naziv je obavezan');

    const action = category.id
      ? this.categoryService.updateCategory(category.id, category)
      : this.categoryService.createCategory(category);

    action.subscribe({
      next: () => {
        this.loadCategories();
        this.selectedCategory = null;

        // Snackbar feedback
        this.snackBar.open(
          category.id ? 'Kategorija je uspješno ažurirana.' : 'Nova kategorija je uspješno kreirana.',
          'Zatvori',
          { duration: 3000, horizontalPosition: 'center', verticalPosition: 'bottom' }
        );
      },
      error: (err) => {
        console.error(err);
        alert('Greška pri čuvanju kategorije.');
      }
    });
  }

  deleteCategory(id: number) {
    if (confirm('Da li ste sigurni da želite da obrišete kategoriju?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
          if (this.selectedCategory?.id === id) this.selectedCategory = null;

          // Snackbar feedback
          this.snackBar.open('Kategorija je uspješno obrisana.', 'Zatvori', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        },
        error: (err) => {
          console.error(err);
          alert('Greška pri brisanju kategorije.');
        }
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
    this.selectCategory(category);
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

  loadCategories() {
    this.categoryService.getCategories().subscribe(res => {
      this.categories = res.data.data;
      this.applyPagination();
    });
  }
}
