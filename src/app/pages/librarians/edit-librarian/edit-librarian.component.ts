import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


import { LibrarianService } from '../../../services/librarian/librarian.service';
import { User } from '../../../models/user.model';
import { catchError, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-edit-librarian',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-librarian.component.html',
  styleUrls: ['./edit-librarian.component.css']
})
export class EditLibrarian implements OnInit {
  private librarianService = inject(LibrarianService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  librarianId!: number;
  librarian?: User;
  selectedFile?: File;
  errorMessage = '';

  form = this.fb.group({
    first_name: ['', [Validators.required, Validators.minLength(2)]],
    last_name: ['', [Validators.required, Validators.minLength(2)]],
    username: ['', [Validators.required, Validators.minLength(4)]],
    email: ['', [Validators.required, Validators.email]],
    jmbg: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
  });

  ngOnInit() {
 
    const resolvedLibrarian = this.route.snapshot.data['librarian'] as User | null;
     //console.log('Podaci iz resolvera:', resolvedLibrarian);
    if (resolvedLibrarian) {
      this.librarian = resolvedLibrarian;
      this.librarianId = resolvedLibrarian.id!;
      this.form.patchValue({
        first_name: resolvedLibrarian.first_name,
        last_name: resolvedLibrarian.last_name,
        username: resolvedLibrarian.username,
        email: resolvedLibrarian.email,
        jmbg: resolvedLibrarian.jmbg,
      });
    } else {
      this.errorMessage = 'Neuspjelo učitavanje podataka bibliotekara.';
      
      this.router.navigate(['/librarians']);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }

  save() {
    if (this.form.invalid) return;

    const updateData = {
      ...this.form.value,
      role_id: this.librarian?.role_id ?? 2 // fallback ako nije učitan
    } as User;


      this.librarianService.updateLibrarian(this.librarianId, updateData).pipe(
        switchMap(() => {
          if (this.selectedFile) {
            return this.librarianService.uploadImage(this.librarianId, this.selectedFile).pipe(
              map(() => true),
              catchError(() => of(false))  // ako upload slike ne uspe, vratimo false
            );
          } else {
            return of(true);  // nema slike za upload, tretiramo kao uspeh
          }
})
        ).subscribe({
          next: (imageUploaded) => {
            if (imageUploaded) {
              alert('Bibliotekar uspješno ažuriran zajedno sa slikom.');
            } else {
              alert('Bibliotekar ažuriran, ali slika nije poslata.');
            }
            this.router.navigate(['/librarians']);
          },
          error: () => {
            this.errorMessage = 'Greška pri ažuriranju bibliotekara.';
          }
        });

  }
}
