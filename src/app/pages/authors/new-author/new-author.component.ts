import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { Router, RouterLink } from '@angular/router';
import { AuthorService } from '../../../services/author/author.service';
import { Author } from '../../../models/author.model';
import { map, of, switchMap } from 'rxjs';

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
      reader.onload = () => {
        this.photoPreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit() {
    if (this.authorForm.invalid) return;

    // Cast form values directly to Author model
    const author = this.authorForm.value as Author;

    this.authorService.createAuthor(author).pipe(
      switchMap(createdAuthor => {
        if (this.selectedFile && createdAuthor.id) {
          return this.authorService.uploadImage(createdAuthor.id, this.selectedFile).pipe(
            map(() => ({ createdAuthor, imageUploaded: true }))
          );
        } else {
          return of({ createdAuthor, imageUploaded: false });
        }
      })
    ).subscribe({
      next: ({ createdAuthor, imageUploaded }) => {
        if (imageUploaded) {
          alert('Autor kreiran i slika uspešno uploadovana!');
        } else {
          alert('Autor uspešno kreiran!');
        }
        this.router.navigate(['/authors']);
      },
      error: (error) => {
        console.error('Greška prilikom kreiranja autora ili uploadu slike:', error);
        alert('Došlo je do greške prilikom kreiranja autora ili uploadu slike.');
      }
    });
  }

  onCancel() {
    this.router.navigate(['/authors']);
  }
}
