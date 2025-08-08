import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


import { StudentService } from '../../../services/student/student.service';
import { User } from '../../../models/user.model';
import { catchError, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-edit-student',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudent implements OnInit {
  private studentService = inject(StudentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  studentId!: number;
  student?: User;
  selectedFile?: File;
  errorMessage = '';
  photoPreview: string | ArrayBuffer | null = null;


  form = this.fb.group({
    first_name: ['', [Validators.required, Validators.minLength(2)]],
    last_name: ['', [Validators.required, Validators.minLength(2)]],
    username: ['', [Validators.required, Validators.minLength(4)]],
    email: ['', [Validators.required, Validators.email]],
    jmbg: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
  });

  ngOnInit() {
    const resolvedStudent = this.route.snapshot.data['student'] as User | null;
    
    if (resolvedStudent) {
      this.student = resolvedStudent;
      this.studentId = resolvedStudent.id!;
      this.form.patchValue({
        first_name: resolvedStudent.first_name,
        last_name: resolvedStudent.last_name,
        username: resolvedStudent.username,
        email: resolvedStudent.email,
        jmbg: resolvedStudent.jmbg,
      });
    } else {
      this.errorMessage = 'Neuspjelo učitavanje podataka studenta.';
      this.router.navigate(['/students']);
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
      role_id: this.student?.role_id ?? 1  
    } as User;

    this.studentService.updateStudent(this.studentId, updateData).pipe(
      switchMap(() => {
        if (this.selectedFile) {
          return this.studentService.uploadImage(this.studentId, this.selectedFile).pipe(
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
          alert('Student uspešno ažuriran sa slikom.');
        } else {
          alert('Student ažuriran, ali slika nije poslata.');
        }
        this.router.navigate(['/students']);
      },
      error: () => {
        this.errorMessage = 'Greška pri ažuriranju studenta.';
      }
    });
  }
}
