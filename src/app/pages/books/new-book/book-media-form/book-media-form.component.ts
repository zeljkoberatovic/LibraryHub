import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-media-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './book-media-form.component.html',
  styleUrls: ['./book-media-form.component.css']
})
export class BookMediaFormComponent {
  private fb = inject(FormBuilder);

  @Output() mediaSubmitted = new EventEmitter<any>();

  mediaForm: FormGroup = this.fb.group({
    images: [[], Validators.required]
  });

  imagePreview: string[] = [];

  // Dodavanje slike (base64 ili path)
  addImage(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          this.imagePreview.push(result);
          const currentImages = this.mediaForm.get('images')?.value || [];
          this.mediaForm.get('images')?.setValue([...currentImages, result]);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  // Brisanje slike
  removeImage(index: number) {
    this.imagePreview.splice(index, 1);
    const currentImages = this.mediaForm.get('images')?.value || [];
    currentImages.splice(index, 1);
    this.mediaForm.get('images')?.setValue(currentImages);
  }

  onSubmit() {
    if (this.mediaForm.valid) {
      this.mediaSubmitted.emit(this.mediaForm.value);
    } else {
      this.mediaForm.markAllAsTouched();
      alert('Molimo dodajte barem jednu sliku knjige.');
    }
  }
}
