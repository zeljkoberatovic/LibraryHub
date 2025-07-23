import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LibrarianService } from '../librarian-service';

@Component({
  selector: 'app-new-librarian',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './new-librarian.html',
  styleUrl: './new-librarian.css'
})
export class NewLibrarian {

  librarianForm: FormGroup;
  photoFile: File | null = null;
  photoPreview: string | ArrayBuffer | null = null;
  apiUrl = 'https://cortex-api.fabrika.me/api/users';
  

  constructor(
    private fb: FormBuilder,
    private service: LibrarianService,
    private router: Router
  ) {
    this.librarianForm = this.fb.group({
      fullName: ['', Validators.required],
      userType: [{ value: 'Bibliotekar', disabled: true }],
      jmbg: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')!.value === form.get('confirmPassword')!.value
      ? null : { mismatch: true };
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.photoFile = file;
      const reader = new FileReader();
      reader.onload = e => this.photoPreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.librarianForm.invalid) return;

    const formData = new FormData();
    formData.append('fullName', this.librarianForm.get('fullName')!.value);
    formData.append('userType', 'Bibliotekar');
    formData.append('jmbg', this.librarianForm.get('jmbg')!.value);
    formData.append('email', this.librarianForm.get('email')!.value);
    formData.append('username', this.librarianForm.get('username')!.value);
    formData.append('password', this.librarianForm.get('password')!.value);
    if (this.photoFile) {
      formData.append('photo', this.photoFile);
    }

    this.service.createLibrarian(formData).subscribe({
      next: () => this.router.navigate(['/librarians']),
      error: err => alert('Greška pri snimanju: ' + (err.error?.message || err.statusText))
    });
  }

  onCancel() {
    this.router.navigate(['/bibliotekari']);
  }

}
