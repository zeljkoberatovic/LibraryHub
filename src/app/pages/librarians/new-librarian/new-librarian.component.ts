import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { Router, RouterLink } from '@angular/router';
import { LibrarianService } from '../../../services/librarian/librarian.service';
import { User } from '../../../models/user.model';
import { map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-new-librarian',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './new-librarian.component.html',
  styleUrls: ['./new-librarian.component.css']
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
    console.log('File input event triggered:', input.files);
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      //console.log('Selected file:', this.selectedFile);
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

    
 this.librarianService.createLibrarian(user).pipe(
  switchMap((response: any)  => {
    const createdUser = response.data; // <-- izvuci korisnika iz data
    console.log('Created user:', createdUser);

    if (this.selectedFile && createdUser.id) {
      console.log('Selected file to upload:', this.selectedFile);
      return this.librarianService.uploadImage(createdUser.id, this.selectedFile).pipe(
        map(() => {
          console.log('Upload successful for user ID:', createdUser.id);
          return { createdUser, imageUploaded: true };
        })
      );
    } else {
      console.log('No file selected, skipping upload');
      return of({ createdUser, imageUploaded: false });
    }
  })
).subscribe({
  next: ({ createdUser, imageUploaded }) => {
    if (imageUploaded) {
      alert('Bibliotekar kreiran i slika uspešno uploadovana!');
    } else {
      alert('Bibliotekar uspešno kreiran!');
    }
    this.router.navigate(['/librarians']);
  },
  error: (error) => {
    console.error('Greška prilikom kreiranja bibliotekara ili uploadu slike:', error);
    alert('Došlo je do greške prilikom kreiranja bibliotekara ili uploadu slike.');
  }
});

  }

  onCancel() {
    this.router.navigate(['/librarians']);
  }
}