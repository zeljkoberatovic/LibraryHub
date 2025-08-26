import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StudentService } from '../../../services/student/student.service';
import { User } from '../../../models/user.model';
import { map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-new-student',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './new-student.component.html',
  styleUrls: ['./new-student.component.css']
})
export class NewStudent {
  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);
  private router = inject(Router);

  studentForm: FormGroup;
  photoPreview: string | ArrayBuffer | null = null;
  selectedFile?: File;

  constructor() {
    this.studentForm = this.fb.group({
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
      reader.onload = () => this.photoPreview = reader.result;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit() {
    if (this.studentForm.invalid) return;

    const form = this.studentForm.value;

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
      role_id: 1, // <--- student
      password: form.password, // mora biti u User modelu opcionalno
    };

    // Kreiranje i upload slike odmah
    this.studentService.createStudent(user).pipe(
      switchMap(createdUser => {
        if (this.selectedFile && createdUser.id) {
          const formData = new FormData();
          formData.append('photo', this.selectedFile); // isto kao kod librarian
          return this.studentService.uploadImage(createdUser.id, this.selectedFile)
            .pipe(map(() => ({ createdUser, imageUploaded: true })));
        } else {
          return of({ createdUser, imageUploaded: false });
        }
      })
    ).subscribe({
      next: ({ createdUser, imageUploaded }) => {
        alert(imageUploaded
          ? 'Student kreiran i slika uspešno uploadovana!'
          : 'Student uspešno kreiran!');
        this.router.navigate(['/students']);
      },
      error: (error) => {
        console.error('Greška prilikom kreiranja studenta ili uploadu slike:', error);
        alert('Došlo je do greške prilikom kreiranja studenta ili uploadu slike.');
      }
    });
  }

  onCancel() {
    this.router.navigate(['/students']);
  }
}
