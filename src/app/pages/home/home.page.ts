import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';
import { Auth } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  loading = true;
  error: string | null = null;

  private contactSub?: Subscription;

  constructor(
    private contactService: ContactService,
    private auth: Auth,
    private toastService: ToastService
  ) {}

   async ngOnInit() {
    const user = this.auth.currentUser;

    if (user) {
      this.contactSub = this.contactService.getContacts(user.uid).subscribe({
        next: (contacts) => {
          this.contacts = contacts;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.error = err.message || 'Error cargando contactos';
          this.loading = false;
          this.toastService.present(this.error, 3000, 'danger');
        },
      });
    } else {
      this.error = 'Usuario no autenticado';
      this.loading = false;
       await this.toastService.present(this.error, 3000, 'danger');
    }
  }

  ngOnDestroy() {
    this.contactSub?.unsubscribe();
  }
}
