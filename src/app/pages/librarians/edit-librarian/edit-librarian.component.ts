import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LibrarianService } from '../../../services/librarian/librarian.service';
import { User } from '../../../models/user.model';
import { switchMap, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-edit-librarian',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './edit-librarian.component.html',
  styleUrls: ['./edit-librarian.component.css']
})
export class EditLibrarian implements OnInit {
  private fb = inject(FormBuilder);
  private librarianService = inject(LibrarianService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  librarianForm: FormGroup;
  librarian?: User | null;
  photoPreview: string | null = null;
  selectedFile?: File;
  librarianId!: number;
  errorMessage?: string;
  isSaving = false;

  constructor() {
    this.librarianForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      jmbg: ['', Validators.required],
      password: [''],
      confirmPassword: [''],
    });
  }

  ngOnInit() {
    this.route.data.subscribe(({ librarian }) => {
      this.librarian = librarian;
      if (librarian) {
        this.librarianId = librarian.id;
        this.librarianForm.patchValue({
          first_name: librarian.first_name,
          last_name: librarian.last_name,
          username: librarian.username,
          email: librarian.email,
          jmbg: librarian.jmbg,
        });
      } else {
        this.errorMessage = 'Greška pri učitavanju podataka o bibliotekaru.';
      }
    });
  }

  getProfilePictureUrl(): string | null {
    if (this.photoPreview) return this.photoPreview;
    if (this.librarian?.profile_picture) {
      return `${environment.imageBaseUrl}uploads/${this.librarian.profile_picture}`;
    }
    return null;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => this.photoPreview = reader.result as string;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  removeSelectedFile() {
    this.selectedFile = undefined;
    this.photoPreview = null;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  onSubmit() {
    if (this.librarianForm.invalid || !this.librarianId) return;

    const form = this.librarianForm.value;

    if (form.password && form.password !== form.confirmPassword) {
      this.errorMessage = 'Šifre se ne poklapaju!';
      return;
    }

    const updatedUser: Partial<User> = {
      first_name: form.first_name,
      last_name: form.last_name,
      username: form.username,
      email: form.email,
      jmbg: form.jmbg,
      role_id: 2,  
      ...(form.password ? { password: form.password } : {})
    };

    this.isSaving = true;
    this.errorMessage = undefined;

    this.librarianService.updateLibrarian(this.librarianId, updatedUser as User).pipe(
      switchMap(user =>
        this.selectedFile
          ? this.librarianService.uploadImage(this.librarianId, this.selectedFile).pipe(
              switchMap(() => of({ user, imageUploaded: true }))
            )
          : of({ user, imageUploaded: false })
      )
    ).subscribe({
      next: ({ imageUploaded }) => {
        this.isSaving = false;
        alert(imageUploaded
          ? 'Bibliotekar uspešno ažuriran i slika uploadovana!'
          : 'Bibliotekar uspešno ažuriran!');
        this.router.navigate(['/librarians']);
      },
      error: (err) => {
        this.isSaving = false;
        console.error(err);
        this.errorMessage = 'Došlo je do greške. Pokušajte ponovo.';
      }
    });
  }

  onCancel() {
    this.router.navigate(['/librarians']);
  }
}
