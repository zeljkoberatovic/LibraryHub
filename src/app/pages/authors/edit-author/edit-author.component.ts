import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthorService } from '../../../services/author/author.service';
import { Author } from '../../../models/author.model';
import { catchError, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-edit-author',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-author.component.html',
  styleUrls: ['./edit-author.component.css']
})
export class EditAuthor implements OnInit {
  private authorService = inject(AuthorService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  authorId!: number;
  author?: Author;
  selectedFile?: File;
  errorMessage = '';
  photoPreview: string | ArrayBuffer | null = null;

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
    } else {
      this.errorMessage = 'Neuspjelo učitavanje podataka autora.';
      this.router.navigate(['/authors']);
    }
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

  save() {
    if (this.form.invalid) return;

    const updateData = {
      ...this.form.value,
    } as Author;

    this.authorService.updateAuthor(this.authorId, updateData).pipe(
      switchMap(() => {
        if (this.selectedFile) {
          return this.authorService.uploadImage(this.authorId, this.selectedFile).pipe(
            map(() => true),
            catchError(() => of(false))
          );
        } else {
          return of(true);
        }
      })
    ).subscribe({
      next: (imageUploaded) => {
        if (imageUploaded) {
          alert('Autor uspešno ažuriran sa slikom.');
        } else {
          alert('Autor ažuriran, ali slika nije poslata.');
        }
        this.router.navigate(['/authors']);
      },
      error: () => {
        this.errorMessage = 'Greška pri ažuriranju autora.';
      }
    });
  }
}
