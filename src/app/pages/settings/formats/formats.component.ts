import { Component } from '@angular/core';
import { LookupListComponent } from '../lookup/lookup-list.component';
import { LookupService } from '../../../shared/services/lookup.service';

@Component({
  selector: 'app-formats',
  imports: [LookupListComponent],
  template: `
    <app-lookup-list
      columnHeader="Naziv formata"
      buttonLabel="Novi format"
      [fetchFn]="lookup.getFormats.bind(lookup)"
    ></app-lookup-list>
  `,
})
export class FormatComponent {
  constructor(public lookup: LookupService) {}
}
