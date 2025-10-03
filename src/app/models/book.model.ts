

export interface Book {
  id: number;
  name: string;
  description?: string;
  number_of_pages: number;
  number_of_copies: number;
  isbn: string;
  language: string;
  script: string;
  binding: string;
  dimensions: string;
  
  images: string[];
  categories: Category[];
  publishers: Publisher[];
  authors: Author[];
  genres: Genre[];


  available?: number;
  reserved?: number;
  issued?: number;
  overdue?: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Publisher {
  id: number;
  name: string;
}

export interface Author {
  id: number;
  first_name: string;
  last_name: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CreateBookDto {
  name: string;
  description?: string;
  number_of_pages: number;
  number_of_copies: number;
  isbn: string;
  language: string;
  script: string;
  binding: string;
  dimensions: string;
  images?: string[];

  category_ids: number[];
  publisher_ids: number[];
  author_ids: number[];
  genre_ids: number[];
}
