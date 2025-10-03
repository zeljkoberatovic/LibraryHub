import { Component, inject, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { BookSettingService } from '@/app/services/settings/book-setting/book-settings.service';

@Component({
  selector: 'app-book-settings',
  standalone: true,
  imports: [],
  templateUrl: './book-settings.component.html',
  styleUrls: ['./book-settings.component.css']
})
export class BookSettingsComponent implements OnInit {
  private service = inject(BookSettingService);
  private route = inject(ActivatedRoute);

  type: 'Povez' | 'Format' | 'Pismo' = 'Povez';
  items: string[] = [];

  ngOnInit(): void {
    this.route.url.subscribe(url => {
      // Poslednji segment rute određuje tip
      const lastSegment = url[url.length - 1]?.path;
      switch(lastSegment) {
        case 'bindings':
          this.type = 'Povez';
          this.items = this.service.getBindings();
          break;
        case 'formats':
          this.type = 'Format';
          this.items = this.service.getFormats();
          break;
        case 'languages':
          this.type = 'Pismo';
          this.items = this.service.getLanguages();
          break;
        default:
          this.type = 'Povez';
          this.items = this.service.getBindings();
      }
    });
  }
}
