import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    // Ovdje možete dodati logiku za logovanje grešaka
    console.error('Globalna greška:', error);
    
  }

}