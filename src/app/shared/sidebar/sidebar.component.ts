import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() toggle = new EventEmitter<void>();

  onHamburgerClick() {
    this.toggle.emit();
  }
}
