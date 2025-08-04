import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StudentService } from '../../../services/student/student.service';
import { User } from '../../../models/user.model';
import { Router, RouterLink } from '@angular/router';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { PaginationService } from '../../../shared/pagination/pagination.service';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, RouterLink],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class Students implements OnInit {
  private studentService = inject(StudentService);
  private router = inject(Router);
  pagination = inject(PaginationService);

  students: User[] = [];
  loading = true;
  sortDirection: 'asc' | 'desc' = 'asc';

  searchTerm: string = '';
  openMenuIndex: number | null = null;

  ngOnInit(): void {
    this.studentService.getAllStudents().subscribe({
      next: users => {
        this.students = users;
        this.pagination.reset();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.actions-cell')) {
      this.openMenuIndex = null;
    }
  }

  filterStudents(): User[] {
    let filtered = this.students;

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(student =>
        (`${student.first_name} ${student.last_name}`).toLowerCase().includes(term) ||
        student.email.toLowerCase().includes(term)
      );
    }

    return filtered.sort((a, b) => {
      const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
      const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
      return this.sortDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
  }

  get pagedStudents(): User[] {
    const filtered = this.filterStudents();
    this.pagination.updateTotal(filtered.length);
    return this.pagination.getPageSlice(filtered);
  }

  onPageChange(page: number): void {
    this.pagination.currentPage = page;
  }

  sortByName(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }

  goToNewStudent(): void {
    this.router.navigate(['/students/new']);
  }

  toggleMenu(index: number): void {
    this.openMenuIndex = this.openMenuIndex === index ? null : index;
  }

  showDetails(student: User): void {
    this.router.navigate(['/students', student.id]);
    this.openMenuIndex = null;
  }

  editUser(student: User): void {
    this.router.navigate(['/students', student.id, 'edit']);
    this.openMenuIndex = null;
  }

  deleteUser(student: User): void {
    if (
      student.id !== undefined &&
      confirm(`Da li ste sigurni da želite da izbrišete korisnika ${student.first_name} ${student.last_name}?`)
    ) {
      this.studentService.deleteStudent(student.id).subscribe(() => {
        this.students = this.students.filter(s => s.id !== student.id);
      });
    }
    this.openMenuIndex = null;
  }
}
