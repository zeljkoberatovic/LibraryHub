import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  PublisherService,
  Publisher,
} from '../../../shared/services/publisher.service';

@Component({
  selector: 'app-publishers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './publishers.component.html',
  styleUrls: ['./publishers.component.css'],
})
export class PublisherComponent implements OnInit {
  publishers: Publisher[] = [];
  loading = false;
  error: string | null = null;

  form: FormGroup;
  editingId: number | null = null;
  showForm = false;

  constructor(private svc: PublisherService, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
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
        this.publishers = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load publishers';
        this.loading = false;
      },
    });
  }

  onNew() {
    this.editingId = null;
    this.form.reset();
    this.showForm = true;
  }

  onEdit(item: Publisher) {
    this.editingId = item.id;
    this.form.patchValue({ name: item.name });
    this.showForm = true;
  }

  onCancel() {
    this.showForm = false;
    this.editingId = null;
    this.form.reset();
  }

  onSubmit() {
    if (this.form.invalid) return;

    const payload = { name: this.form.value.name };
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

  onDelete(item: Publisher) {
    if (!confirm(`Delete "${item.name}"?`)) return;
    this.svc.delete(item.id).subscribe({
      next: () => this.load(),
      error: () => (this.error = 'Delete failed'),
    });
  }
}
