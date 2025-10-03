import { Injectable, inject } from '@angular/core';
import { Resolve } from '@angular/router';
import { CategoryService } from '@/app/services/settings/category/category.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryResolver implements Resolve<any> {
  private categoryService = inject(CategoryService);

  resolve(): Observable<any> {
    return this.categoryService.getCategories();
  }
}
