export interface Rental {
  id: number;
  book_id: number;
  student_id: number;
  librarian_id: number;
  rented_at: string;
  returned_at?: string | null;
  book?: Book;
   student?: { id: number; name: string };
  librarian?: { id: number; name: string };
  overdue_days?: number;
  active_days_of_rental?: number;
}

export interface RentalMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface RentalResponse {
  status: "success" | "error";
  data: {
    meta: RentalMeta;
    data: Rental[];
  };
}

export interface RentalSummary {
  status: "success";
  rented_not_overdue: number;
  rented_overdue: number;
}

export interface RentBookRequest {
  book_id: number;
  student_id: number;
  librarian_id: number;
}

export interface ReturnBookRequest {
  book_id: number;
  student_id: number;
  librarian_id: number;
}

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
  name: string;
  description?: string | null;
  number_of_pages?: number;
  number_of_copies?: number;
  isbn?: string;
  language?: string;
  binding?: string;
  script?: string;
  dimensions?: string;
  created_at?: string;
  updated_at?: string;
}
