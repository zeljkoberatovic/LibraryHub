import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../services/student/student.service';
import { User } from '../../../models/user.model';
import { switchMap, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-edit-student',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudent implements OnInit {
  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  studentForm: FormGroup;
  student?: User | null;
  photoPreview: string | null = null; 
  selectedFile?: File;
  studentId!: number;
  errorMessage?: string;
  isSaving = false;

  constructor() {
    this.studentForm = this.fb.group({
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
    this.route.data.subscribe(({ student }) => {
      this.student = student;
      if (student) {
        this.studentId = student.id;
        this.studentForm.patchValue({
          first_name: student.first_name,
          last_name: student.last_name,
          username: student.username,
          email: student.email,
          jmbg: student.jmbg,
        });
        this.photoPreview = null;
      } else {
        this.errorMessage = 'Greška pri učitavanju podataka o studentu.';
      }
    });
  }

  getProfilePictureUrl(): string {
    if (this.photoPreview) return this.photoPreview;
    if (this.student?.profile_picture) {
      return `${environment.imageBaseUrl}${this.student.profile_picture}`;
    }
    return 'assets/default-user.png';
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
    if (this.studentForm.invalid || !this.studentId) return;

    const form = this.studentForm.value;

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
      ...(form.password ? { password: form.password } : {})
    };

    this.isSaving = true;
    this.errorMessage = undefined;

    this.studentService.updateStudent(this.studentId, updatedUser as User).pipe(
      switchMap(user =>
        this.selectedFile
          ? this.studentService.uploadImage(this.studentId, this.selectedFile).pipe(
              switchMap(() => of({ user, imageUploaded: true }))
            )
          : of({ user, imageUploaded: false })
      )
    ).subscribe({
      next: ({ imageUploaded }) => {
        this.isSaving = false;
        alert(imageUploaded
          ? 'Student uspešno ažuriran i slika uploadovana!'
          : 'Student uspešno ažuriran!');
        this.router.navigate(['/students']);
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = 'Došlo je do greške. Pokušajte ponovo.';
      }
    });
  }

  onCancel() {
    this.router.navigate(['/students']);
  }
}
