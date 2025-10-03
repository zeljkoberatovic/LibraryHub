import { Injectable, inject } from '@angular/core';
import { Resolve } from '@angular/router';
import { PublisherService } from '@/app/services/settings/publisher/publisher.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PublishersResolver implements Resolve<any> {
  private publisherService = inject(PublisherService);

  resolve(): Observable<any> {
    return this.publisherService.getPublishers();
  }
}
