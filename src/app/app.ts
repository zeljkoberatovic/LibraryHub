import { Component } from '@angular/core';
import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  imports: [HeaderComponent, SidebarComponent, RouterOutlet],
})
export class App {
  isSidebarCollapsed = false;
}
