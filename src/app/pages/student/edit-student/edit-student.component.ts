import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StudentService } from '../../../services/student/student.service';
import { User } from '../../../models/user.model';
import { switchMap, of } from 'rxjs';
import { CommonModule } from '@angular/common';

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
  student?: User;
  photoPreview: string | ArrayBuffer | null = null;
  selectedFile?: File;
  studentId!: number;
  errorMessage?: string;

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
    this.studentId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.studentId) {
      this.studentService.getStudent(this.studentId).subscribe({
        next: student => {
          this.student = student;
          this.studentForm.patchValue({
            first_name: student.first_name,
            last_name: student.last_name,
            username: student.username,
            email: student.email,
            jmbg: student.jmbg,
          });
          this.photoPreview = student.profile_picture || null;
        },
        error: () => this.errorMessage = 'Greška pri učitavanju podataka o studentu.'
      });
    }
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

    if (form.password && form.password !== form.confirmPassword) {
      alert('Šifre se ne poklapaju!');
      return;
    }

    const updatedUser: Partial<User> = {
      first_name: form.first_name,
      last_name: form.last_name,
      username: form.username,
      email: form.email,
      jmbg: form.jmbg,
    };

    if (form.password) updatedUser.password = form.password;

    this.studentService.updateStudent(this.studentId, updatedUser as User).pipe(
      switchMap(user => {
        if (this.selectedFile) {
          return this.studentService.uploadImage(this.studentId, this.selectedFile)
            .pipe(switchMap(() => of({ user, imageUploaded: true })));
        } else {
          return of({ user, imageUploaded: false });
        }
      })
    ).subscribe({
      next: ({ user, imageUploaded }) => {
        alert(imageUploaded
          ? 'Student uspešno ažuriran i slika uploadovana!'
          : 'Student uspešno ažuriran!');
        this.router.navigate(['/students']);
      },
      error: (error) => {
        console.error('Greška prilikom ažuriranja studenta ili uploadu slike:', error);
        alert('Došlo je do greške prilikom ažuriranja studenta ili uploadu slike.');
      }
    });
  }

  onCancel() {
    this.router.navigate(['/students']);
  }
}
