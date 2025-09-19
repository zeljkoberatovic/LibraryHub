import { Author } from './author.model';

export interface Book {
  id?: number;  
  name: string;
  description: string;
  number_of_pages: number;
  number_of_copies: number;
  isbn: string;
  language: string;
  script: string;
  binding: string;
  dimensions: string;

  categories?: { id: number; name: string }[] | null; // placeholder
  genres?: { id: number; name: string }[] | null;     // placeholder
  publishers?: { id: number; name: string; established_year?: string }[] | null; // placeholder
  authors?: Author[] | null; 

   
  available?: number;
  reserved?: number;
  issued?: number;
  overdue?: number;
}
