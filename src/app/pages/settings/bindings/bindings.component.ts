import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LookupListComponent } from '../lookup/lookup-list.component';
import { LookupService } from '../../../shared/services/lookup.service';

@Component({
  selector: 'app-bindings',
  imports: [LookupListComponent],
  template: `
    <app-lookup-list
      columnHeader="Naziv poveza"
      buttonLabel="Novi povez"
      [fetchFn]="lookup.getBindings.bind(lookup)"
    ></app-lookup-list>
  `,
})
export class BindingComponent {
  constructor(public lookup: LookupService) {}
}
