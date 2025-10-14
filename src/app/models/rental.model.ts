export interface Book {
  id: number;
  name: string;
  description?: string | null;
  number_of_pages: number;
  number_of_copies: number;
  isbn: string;
  language: string;
  binding: string;
  script: string;
  dimensions: string;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  username?: string;
  email?: string;
  jmbg?: string;
  profile_picture?: string | null;
  created_at?: string;
  
}

export interface Librarian {
  id: number;
  first_name: string;
  last_name: string;
  username?: string;
  email?: string;
  profile_picture?: string | null;
  created_at?: string;
  
}

export interface Rental {
  id: number;
  book_id: number;
  student_id: number;
  librarian_id: number;
  rented_at: string;   // "2025-08-06 13:34:29"
  returned_at: string | null;
  active_days_of_rental?: number;

  book?: Book;
  student?: Student;
  librarian?: Librarian;
}