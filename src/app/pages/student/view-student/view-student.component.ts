import { Component, inject, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-view-student',
  standalone: true,
  imports: [],
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  student: User | null = null;

  ngOnInit(): void {
    const resolvedStudent = this.route.snapshot.data['student'];
    if (resolvedStudent) {
      this.student = resolvedStudent;
    } else {
      alert('Student nije pronađen.');
      this.router.navigate(['/students']);
    }
  }

  goBack() {
    this.router.navigate(['/students']);
  }
}
