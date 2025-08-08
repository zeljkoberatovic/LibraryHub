import { Component, OnInit } from '@angular/core';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GenreService, Genre } from '../../../shared/services/genre.service';

@Component({
  selector: 'app-genres',
  imports: [ReactiveFormsModule],
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.css'],
})
export class GenreComponent implements OnInit {
  genres: Genre[] = [];
  loading = false;
  error: string | null = null;

  form: FormGroup;
  editingId: number | null = null;
  showForm = false;

  constructor(private svc: GenreService, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit() {
    this.load();
  }

  private load() {
    this.loading = true;
    this.error = null;
    this.svc.list().subscribe({
      next: (data) => {
        this.genres = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load genres';
        this.loading = false;
      },
    });
  }

  onNew() {
    this.editingId = null;
    this.form.reset();
    this.showForm = true;
  }

  onEdit(item: Genre) {
    this.editingId = item.id;
    this.form.patchValue({ name: item.name, description: item.description });
    this.showForm = true;
  }

  onCancel() {
    this.showForm = false;
    this.editingId = null;
    this.form.reset();
  }

  onSubmit() {
    if (this.form.invalid) return;

    const payload = this.form.value;
    const obs = this.editingId
      ? this.svc.update(this.editingId, payload)
      : this.svc.create(payload);

    obs.subscribe({
      next: () => {
        this.showForm = false;
        this.load();
      },
      error: () => {
        this.error = this.editingId ? 'Update failed' : 'Create failed';
      },
    });
  }

  onDelete(item: Genre) {
    if (!confirm(`Delete "${item.name}"?`)) return;
    this.svc.delete(item.id).subscribe({
      next: () => this.load(),
      error: () => (this.error = 'Delete failed'),
    });
  }
}
