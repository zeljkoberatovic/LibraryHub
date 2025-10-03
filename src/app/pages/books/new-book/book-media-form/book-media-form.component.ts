import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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

  // Forma bez validatora za slike jer nisu obavezne
  mediaForm: FormGroup = this.fb.group({
    // Prazna forma jer slike nisu potrebne
  });

  onSubmit() {
    // Emitujemo prazan objekat jer ne šaljemo slike
    this.mediaSubmitted.emit({});
    alert('Mediji su sačuvani (nema slika za upload)');
  }
}