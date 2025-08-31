import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthorService } from '../../../services/author/author.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-author',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, FormsModule, CommonModule],
  templateUrl: './new-author.component.html',
  styleUrls: ['./new-author.component.css']
})
export class NewAuthor {
  private fb = inject(FormBuilder);
  private authorService = inject(AuthorService);
  private router = inject(Router);

  authorForm: FormGroup;

  constructor() {
    this.authorForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      biography: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.authorForm.invalid) {
      alert('Molimo popunite sva polja');
      return;
    }

    const formData = {
      first_name: this.authorForm.get('first_name')?.value || '',
      last_name: this.authorForm.get('last_name')?.value || '',
      biography: this.authorForm.get('biography')?.value || ''
    };

    this.authorService.createAuthor(formData).subscribe({
      next: () => {
        alert('Autor uspešno kreiran!');
        this.router.navigate(['/authors']);
      },
      error: (err) => {
        alert(err.status === 422
          ? 'Validation error: ' + JSON.stringify(err.error?.errors)
          : 'Greška pri kreiranju autora.');
      }
    });
  }

  onCancel() {
    this.router.navigate(['/authors']);
  }
}
