import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookSettingService {
  // Statistički podaci
  bindings = ['Tvrdi', 'Meki', 'Spiralni'];
  formats = ['A4', 'A5', 'B5', 'Pocket'];
  languages = ['Latinica', 'Ćirilica'];

  constructor() { }

  getBindings(): string[] {
    return [...this.bindings];
  }

  getFormats(): string[] {
    return [...this.formats];
  }

  getLanguages(): string[] {
    return [...this.languages];
  }
}
