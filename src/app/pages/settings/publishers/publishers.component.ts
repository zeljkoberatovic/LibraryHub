import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublisherService } from '@/app/services/settings/publisher/publisher.service';
import { Publisher } from '@/app/models/publisher.model';
import { PaginationService } from '@/app/shared/pagination/pagination.service';
import { PaginationComponent } from '@/app/shared/pagination/pagination.component';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-publishers',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './publishers.component.html',
  styleUrls: ['./publishers.component.css'],
})
export class PublishersComponent implements OnInit {
  private publisherService = inject(PublisherService);
  public paginationService = inject(PaginationService);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  publishers: Publisher[] = [];
  displayedPublishers: Publisher[] = [];
  selectedPublisher: Publisher | null = null;
  searchTerm: string = '';
  openMenuIndex: number | null = null;

  errors: any = {}; // za inline greške

  ngOnInit(): void {
  this.publishers = this.route.snapshot.data['publishers'].data.data;
  this.displayedPublishers = [...this.publishers];
}

  emptyPublisher(): Publisher {
    return { name: '', address: '', website: '', email: '', phone_number: '', established_year: '' };
  }

  loadPublishers() {
    this.publisherService.getPublishers().subscribe(res => {
      this.publishers = res.data.data;
      this.applyPagination();
    });
  }

  applyPagination() {
    const filtered = this.filteredPublishers;
    this.paginationService.updateTotal(filtered.length);
    this.displayedPublishers = this.paginationService.getPageSlice(filtered);
  }

  selectPublisher(pub: Publisher) {
    this.selectedPublisher = { ...pub };
    this.errors = {};
    this.openMenuIndex = null;
  }

  onFieldChange(field: keyof Publisher) {
    if (!this.selectedPublisher) return;
    this.validatePublisherField(field, this.selectedPublisher);
  }

  validatePublisherField(field: keyof Publisher, pub: Publisher) {
    switch (field) {
      case 'name':
        this.errors.name = pub.name.trim() ? '' : 'Naziv je obavezan';
        break;
      case 'address':
        this.errors.address = pub.address.trim() ? '' : 'Adresa je obavezna';
        break;
      case 'email':
        if (!pub.email.trim()) this.errors.email = 'Email je obavezan';
        else this.errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pub.email) ? '' : 'Email nije validan';
        break;
      case 'phone_number':
        if (!pub.phone_number.trim()) this.errors.phone_number = 'Telefon je obavezan';
        else this.errors.phone_number = /^\d{3}-\d{3}-\d{4}$/.test(pub.phone_number) ? '' : 'Telefon mora biti u formatu 123-456-7890';
        break;
      case 'established_year':
        if (!pub.established_year.trim()) this.errors.established_year = 'Godina osnivanja je obavezna';
        else if (isNaN(+pub.established_year) || +pub.established_year < 1000 || +pub.established_year > new Date().getFullYear())
          this.errors.established_year = 'Godina osnivanja nije validna';
        else this.errors.established_year = '';
        break;
      case 'website':
        if (pub.website && pub.website.trim()) {
          try { new URL(pub.website); this.errors.website = ''; } 
          catch { this.errors.website = 'Website mora biti validan URL'; }
        } else this.errors.website = '';
        break;
    }
  }

  validatePublisher(pub: Publisher): boolean {
    ['name','address','email','phone_number','established_year','website'].forEach(field => 
      this.validatePublisherField(field as keyof Publisher, pub)
    );
    return Object.values(this.errors).every(e => !e);
  }

  savePublisher(pub: Publisher) {
    if (!this.validatePublisher(pub)) return;

    const action = pub.id
      ? this.publisherService.updatePublisher(pub.id, pub)
      : this.publisherService.createPublisher(pub);

    action.subscribe({
      next: () => {
        this.loadPublishers();
        this.selectedPublisher = null;
        this.snackBar.open('Promjene su uspješno sačuvane.', 'Zatvori', {
      duration: 3000
    });
      },
      error: (err: any) => {
        console.error(err);
        if (err.error?.errors?.email) this.errors.email = 'Email već postoji, unesite drugi.';
        else alert('Greška pri čuvanju izdavača. Provjerite unesene podatke.');
      }
    });
  }

  deletePublisher(id: number) {
  if (confirm('Da li ste sigurni da želite da obrišete izdavača?')) {
    this.publisherService.deletePublisher(id).subscribe({
      next: () => {
        this.loadPublishers();
        if (this.selectedPublisher?.id === id) this.selectedPublisher = null;

        // Snackbar feedback
        this.snackBar.open('Izdavač je uspješno obrisan.', 'Zatvori', {
          duration: 3000,
          horizontalPosition: 'center', 
          verticalPosition: 'bottom'   
        });
      },
      error: (err) => {
        console.error(err);
        alert('Greška pri brisanju izdavača.');
      }
    });
  }
}


  cancelEdit() {
    this.selectedPublisher = null;
    this.errors = {};
  }

  toggleMenu(index: number) {
    this.openMenuIndex = this.openMenuIndex === index ? null : index;
  }

  editPublisher(pub: Publisher) {
    this.selectPublisher(pub);
    this.openMenuIndex = null;
  }

  get filteredPublishers() {
    if (!this.searchTerm) return this.publishers;
    return this.publishers.filter(pub =>
      pub.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onPageChange(page: number) {
    this.paginationService.currentPage = page;
    this.applyPagination();
  }
}
