import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { LibrarianService } from '../../../services/librarian/librarian';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-edit-librarian',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-librarian.html',
  styleUrls: ['./edit-librarian.css']
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
      
      this.router.navigate(['/bibliotekari']);
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

    this.librarianService.updateLibrarian(this.librarianId, updateData).subscribe({
      next: () => {
        if (this.selectedFile) {
          this.librarianService.uploadImage(this.librarianId, this.selectedFile).subscribe({
            next: () => {
              alert('Bibliotekar uspješno ažuriran zajedno sa slikom.');
              this.router.navigate(['/bibliotekari']);
            },
            error: () => {
              alert('Bibliotekar ažuriran, ali slika nije poslata.');
              this.router.navigate(['/bibliotekari']);
            }
          });
        } else {
          alert('Bibliotekar uspješno ažuriran.');
          this.router.navigate(['/bibliotekari']);
        }
      },
      error: () => {
        this.errorMessage = 'Greška pri ažuriranju bibliotekara.';
      }
    });
  }
}
