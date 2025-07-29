import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LibrarianService } from '../../../services/librarian/librarian';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-new-librarian',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './new-librarian.html',
  styleUrls: ['./new-librarian.css']
})
export class NewLibrarian {
  private fb = inject(FormBuilder);
  private librarianService = inject(LibrarianService);
  private router = inject(Router);

  librarianForm: FormGroup;
  photoPreview: string | ArrayBuffer | null = null;
  selectedFile?: File;

  constructor() {
    this.librarianForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      jmbg: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
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
    if (this.librarianForm.invalid) return;

    const form = this.librarianForm.value;

    if (form.password !== form.confirmPassword) {
      alert('Šifre se ne poklapaju!');
      return;
    }

    const user: User = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      username: form.username,
      jmbg: form.jmbg,
      role_id: 2,
      
    };

    this.librarianService.createLibrarian(user).subscribe({
      next: (createdUser) => {
        if (this.selectedFile && createdUser.id) {
          this.librarianService.uploadImage(createdUser.id, this.selectedFile).subscribe({
            next: () => {
              alert('Bibliotekar kreiran i slika uspešno uploadovana!');
              this.router.navigate(['/bibliotekari']);
            },
            error: (err) => {
              console.error('Greška pri uploadu slike:', err);
              alert('Bibliotekar kreiran, ali slika nije uploadovana.');
              this.router.navigate(['/bibliotekari']);
            }
          });
        } else {
          alert('Bibliotekar uspešno kreiran!');
          this.router.navigate(['/bibliotekari']);
        }
      },
      error: (error) => {
        console.error('Greška prilikom kreiranja bibliotekara:', error);
        alert('Došlo je do greške prilikom kreiranja bibliotekara.');
      }
    });
  }

  onCancel() {
    this.router.navigate(['/bibliotekari']);
  }
}
