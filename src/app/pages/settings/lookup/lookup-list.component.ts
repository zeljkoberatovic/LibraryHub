
import { Component, Input, OnInit } from '@angular/core';

import { LookupService }           from '../../../shared/services/lookup.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lookup-list',
  standalone: true,
  imports: [],
  template: `
    <div class="px-6 py-4">
      <div class="flex justify-between items-center mb-6">
        <button (click)="onNew()" class="bg-[#4558BE] text-white px-4 py-2 rounded">
          + {{ buttonLabel }}
        </button>
      </div>

      <div class="bg-white shadow rounded overflow-hidden">
        <table class="min-w-full">
          <thead class="bg-gray-100">
            <tr>
              <th class="p-4"><input type="checkbox" /></th>
              <th class="p-4 text-left font-medium">{{ columnHeader }}</th>
              <th class="p-4"></th>
            </tr>
          </thead>
          <tbody>
            @for (item of items; track item) {
<tr class="border-t">
              <td class="p-4"><input type="checkbox" /></td>
              <td class="p-4">{{ item }}</td>
              <td class="p-4 text-right">
                <button (click)="onEdit(item)">
                  <i class="fas fa-ellipsis-v text-gray-500"></i>
                </button>
              </td>
            </tr>
}
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class LookupListComponent implements OnInit {
  @Input() title!: string;
  @Input() columnHeader!: string;
  @Input() buttonLabel!: string;
  @Input() fetchFn!: () => Observable<string[]>;

  items: string[] = [];

  constructor(private lookup: LookupService) {}

  ngOnInit() {
    this.fetchFn().subscribe(data => (this.items = data));
  }

  onNew() { }
  onEdit(item: string) { }
}
