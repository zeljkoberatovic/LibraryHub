import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LibrarianService } from '../../../services/librarian/librarian.service';
import { User } from '../../../models/user.model';


@Component({
  selector: 'app-new-librarian',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './new-librarian.component.html',
  styleUrls: ['./new-librarian.component.css']
})
export class NewLibrarian {
  private fb = inject(FormBuilder);
  private librarianService = inject(LibrarianService);
  private router = inject(Router);

  librarianForm: FormGroup;

  constructor() {
    this.librarianForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      jmbg: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.librarianForm.invalid) return;

    const form = this.librarianForm.value;

    if (form.password !== form.confirmPassword) {
      this.librarianForm.get('confirmPassword')?.setErrors({ mismatch: true });
      return;
    }

    const user: User = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      username: form.username,
      jmbg: form.jmbg,
      role_id: 2, 
      password: form.password,
    };

    this.librarianService.createLibrarian(user).subscribe({
      next: () => {
        alert('Bibliotekar uspešno kreiran!');
        this.router.navigate(['/librarians']);
      },
      error: (error) => {
        if (error.error?.errors) {
          if (error.error.errors.email) this.librarianForm.get('email')?.setErrors({ emailTaken: true });
          if (error.error.errors.username) this.librarianForm.get('username')?.setErrors({ usernameTaken: true });
          if (error.error.errors.jmbg) this.librarianForm.get('jmbg')?.setErrors({ jmbgTaken: true });
        } else {
          alert('Došlo je do greške prilikom kreiranja bibliotekara.');
        }
      }
    });
  }

  onCancel() {
    this.router.navigate(['/librarians']);
  }
}
