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

  categories?: number[] | null;
  genres?: number[] | null;
  publishers?: number[] | null;
  authors: number[] | null; 
}
