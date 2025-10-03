import { Component, inject, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-media-form',
  standalone: true,
  templateUrl: './book-media-form.component.html',
  styleUrls: ['./book-media-form.component.css'],
  imports: [ReactiveFormsModule]
})
export class BookMediaFormComponent {
  private fb = inject(FormBuilder);

  @Output() mediaSubmitted = new EventEmitter<any>();

  mediaForm: FormGroup= this.fb.group({
     picture: this.fb.control<File[]>([]) 
  });

  imagePreview: string | null = null;

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      const file = target.files[0];
      this.mediaForm.get('picture')?.setValue(file);

      // Generiši preview
      const reader = new FileReader();
      reader.onload = e => this.imagePreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.mediaForm.valid) {
      this.mediaSubmitted.emit(this.mediaForm.value);
    }
  }
}