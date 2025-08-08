import { Component, OnInit } from '@angular/core';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { CategoryService, Category } from '../../../shared/services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  loading = false;
  error: string | null = null;

  categoryForm: FormGroup;
  editingId: number | null = null;
  iconPreviewUrl: string | null = null;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      icon: [null]       // we'll set a File here
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.loading = true;
    this.error = null;
    this.categoryService.list().subscribe({
      next: cats => {
        this.categories = cats;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load categories.';
        this.loading = false;
      }
    });
  }

  onCreate(): void {
    if (this.categoryForm.invalid) return;

    const formData = new FormData();
    formData.append('name', this.categoryForm.value.name);
    formData.append('description', this.categoryForm.value.description);
    const iconFile: File = this.categoryForm.value.icon;
    if (iconFile) {
      formData.append('icon', iconFile, iconFile.name);
    }

    this.categoryService.create(formData).subscribe({
      next: () => {
        this.categoryForm.reset();
        this.iconPreviewUrl = null;
        this.loadCategories();
      },
      error: () => {
        this.error = 'Failed to create category.';
      }
    });
  }

  onEdit(cat: Category): void {
    this.editingId = cat.id;
    this.categoryForm.patchValue({
      name: cat.name,
      description: cat.description,
      icon: null
    });
    this.iconPreviewUrl = cat.icon || null;
  }

  onUpdate(): void {
    if (this.categoryForm.invalid || this.editingId === null) return;

    const formData = new FormData();
    formData.append('name', this.categoryForm.value.name);
    formData.append('description', this.categoryForm.value.description);
    const iconFile: File = this.categoryForm.value.icon;
    if (iconFile) {
      formData.append('icon', iconFile, iconFile.name);
    }

    this.categoryService.update(this.editingId, formData).subscribe({
      next: () => {
        this.editingId = null;
        this.categoryForm.reset();
        this.iconPreviewUrl = null;
        this.loadCategories();
      },
      error: () => {
        this.error = 'Failed to update category.';
      }
    });
  }

  onDelete(cat: Category): void {
    if (!confirm(`Delete "${cat.name}"?`)) return;
    this.categoryService.delete(cat.id).subscribe({
      next: () => this.loadCategories(),
      error: () => this.error = 'Failed to delete category.'
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    this.categoryForm.patchValue({ icon: file });

    // Preview
    const reader = new FileReader();
    reader.onload = () => this.iconPreviewUrl = reader.result as string;
    reader.readAsDataURL(file);
  }

   showForm = false;

  onCancelEdit(): void {
    this.editingId = null;
    this.categoryForm.reset();
    this.iconPreviewUrl = null;
  }
}
