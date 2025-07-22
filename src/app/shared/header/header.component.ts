import { Component } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [NgIf],
})
export class HeaderComponent {
  showCreateMenu = false;
  toggleCreate() {
    this.showCreateMenu = !this.showCreateMenu;
  }
}
