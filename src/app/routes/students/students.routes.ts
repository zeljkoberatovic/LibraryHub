import { Route } from '@angular/router';
import { studentResolver } from '@/app/resolvers/student/student-resolver';
import { authGuard } from '@/app/core/guards/auth.guard';

export const studentsRoutes: Route[] = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('@/app/pages/student/students/students.component').then(m => m.Students)
  },
  {
    path: 'new',
    canActivate: [authGuard],
    loadComponent: () => import('@/app/pages/student/new-student/new-student.component').then(m => m.NewStudent)
  },
  {
    path: ':id',
    canActivate: [authGuard],
    loadComponent: () => import('@/app/pages/student/view-student/view-student.component').then(m => m.ViewStudent),
    resolve: { student: studentResolver }
  },
  {
    path: ':id/edit',
    canActivate: [authGuard],
    loadComponent: () => import('@/app/pages/student/edit-student/edit-student.component').then(m => m.EditStudent),
    resolve: { student: studentResolver }
  }
];