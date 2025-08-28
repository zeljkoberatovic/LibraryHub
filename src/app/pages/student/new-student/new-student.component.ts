import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from '../../../services/student/student.service';
import { User } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-new-student',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink, CommonModule],
  templateUrl: './new-student.component.html',
  styleUrls: ['./new-student.component.css']
})
export class NewStudent {
  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);
  private router = inject(Router);

  studentForm: FormGroup;
  photoPreview: string | ArrayBuffer | null = null;

  constructor() {
    this.studentForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      jmbg: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => this.photoPreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  removeSelectedFile() {
    this.photoPreview = null;
  }

  onSubmit() {
    if (this.studentForm.invalid) return;

    const form = this.studentForm.value;

    if (form.password !== form.confirmPassword) {
      this.studentForm.get('confirmPassword')?.setErrors({ mismatch: true });
      return;
    }

    const user: User = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      username: form.username,
      jmbg: form.jmbg,
      role_id: 1,
      password: form.password,
    };

    this.studentService.createStudent(user).subscribe({
      next: () => {
        alert('Student uspešno kreiran!');
        this.router.navigate(['/students']);
      },
      error: (error) => {
        if (error.error?.errors) {
          if (error.error.errors.email) this.studentForm.get('email')?.setErrors({ emailTaken: true });
          if (error.error.errors.username) this.studentForm.get('username')?.setErrors({ usernameTaken: true });
          if (error.error.errors.jmbg) this.studentForm.get('jmbg')?.setErrors({ jmbgTaken: true });
        } else {
          alert('Došlo je do greške prilikom kreiranja studenta.');
        }
      }
    });
  }

  onCancel() {
    this.router.navigate(['/students']);
  }
}
