import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthorService } from '../../../services/author/author.service';

@Component({
  selector: 'app-new-author',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './new-author.component.html',
  styleUrls: ['./new-author.component.css']
})
export class NewAuthor {
  private fb = inject(FormBuilder);
  private authorService = inject(AuthorService);
  private router = inject(Router);

  authorForm: FormGroup;
  photoPreview: string | ArrayBuffer | null = null;
  selectedFile?: File;

  constructor() {
    this.authorForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      biography: ['', Validators.required],
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => this.photoPreview = reader.result;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit() {
    if (this.authorForm.invalid) {
      alert('Molimo popunite sva polja');
      return;
    }

    const formData = new FormData();
    formData.append('first_name', this.authorForm.get('first_name')?.value || '');
    formData.append('last_name', this.authorForm.get('last_name')?.value || '');
    formData.append('biography', this.authorForm.get('biography')?.value || '');
    if (this.selectedFile) {
      formData.append('picture', this.selectedFile);
    }

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
