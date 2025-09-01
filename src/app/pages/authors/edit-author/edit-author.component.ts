import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorService } from '../../../services/author/author.service';
import { Author } from '../../../models/author.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-author',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-author.component.html',
  styleUrls: ['./edit-author.component.css']
})
export class EditAuthor implements OnInit {
  private authorService = inject(AuthorService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  author!: Author;
  authorId!: number;
  selectedFile?: File;
  photoPreview: string | ArrayBuffer | null = null;
  errorMessage = '';
  isSaving: boolean = false;

  form = this.fb.group({
    first_name: ['', [Validators.required, Validators.minLength(2)]],
    last_name: ['', [Validators.required, Validators.minLength(2)]],
    biography: ['', [Validators.required, Validators.minLength(10)]],
  });

  ngOnInit() {
    const resolvedAuthor = this.route.snapshot.data['author'] as Author | null;

    if (resolvedAuthor) {
      this.author = resolvedAuthor;
      this.authorId = resolvedAuthor.id!;
      this.form.patchValue({
        first_name: resolvedAuthor.first_name,
        last_name: resolvedAuthor.last_name,
        biography: resolvedAuthor.biography,
      });
      if (resolvedAuthor.picture) {
        this.photoPreview = this.getAuthorImageUrl(resolvedAuthor.picture);
      }
    } else {
      this.errorMessage = 'Neuspjelo učitavanje podataka autora.';
      this.router.navigate(['/authors']);
    }
  }

  getAuthorImageUrl(picture?: string | null): string {
    return this.authorService.getAuthorImageUrl(picture ?? undefined);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => (this.photoPreview = reader.result);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  save() {
    if (this.form.invalid) {
      alert('Molimo popunite sva obavezna polja');
      return;
    }

    const formData = new FormData();
    formData.append('first_name', this.form.get('first_name')?.value || '');
    formData.append('last_name', this.form.get('last_name')?.value || '');
    formData.append('biography', this.form.get('biography')?.value || '');
    formData.append('_method', 'PUT');
    if (this.selectedFile) {
      formData.append('picture', this.selectedFile);
    }

    this.authorService.updateAuthor(this.authorId, formData).subscribe({
      next: () => {
        alert('Autor uspešno ažuriran!');
        this.router.navigate(['/authors']);
      },
      error: (err) => {
        this.errorMessage =
          err.status === 422
            ? 'Validation error: ' + JSON.stringify(err.error?.errors)
            : 'Greška pri ažuriranju autora.';
      },
    });
  }

  onCancel() {
    this.router.navigate(['/authors']);
  }
}
