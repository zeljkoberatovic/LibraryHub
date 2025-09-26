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
  mediaForm: any;
  imagePreview: null | undefined;
  
}