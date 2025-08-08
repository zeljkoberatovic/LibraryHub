import { Component } from '@angular/core';
import { LookupListComponent } from '../lookup/lookup-list.component';
import { LookupService } from '../../../shared/services/lookup.service';

@Component({
  selector: 'app-languages',
  imports: [LookupListComponent],
  template: `
    <app-lookup-list
      columnHeader="Naziv pisma"
      buttonLabel="Novo pismo"
      [fetchFn]="lookup.getScripts.bind(lookup)"
    ></app-lookup-list>
  `,
})
export class LanguageComponent {
  constructor(public lookup: LookupService) {}
}
