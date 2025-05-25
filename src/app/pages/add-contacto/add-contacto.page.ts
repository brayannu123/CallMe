import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ContactService } from '../../services/contact.service';
import { Contact } from 'src/app/models/contact.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-add-contacto',
  templateUrl: './add-contacto.page.html',
  styleUrls: ['./add-contacto.page.scss'],
  standalone: false,
})
export class AddContactoPage {
  contactForm: FormGroup;
  loading = false;
  error: string | null = null;
  uid: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastService: ToastService,
    private contactService: ContactService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{10}')]]
    });
  }

  async onSubmit() {
    await this.addContact();
  }

  async addContact() {
    const loading = await this.loadingCtrl.create({
      message: 'Verificando contacto...',
    });
    await loading.present();

    if (!this.contactForm.valid) {
      await loading.dismiss();
      this.error = 'Por favor, introduce un número de teléfono válido (10 dígitos)';
      this.toastService.present(this.error, 2000, 'danger');
      return;
    }

    this.uid = this.contactService.getCurrentUserId();
    const phone = this.contactForm.value.phoneNumber.trim();
    const name = this.contactForm.value.name.trim();

    try {
      const contactUid = await this.contactService.findUserByPhoneNumber(phone);

      if (contactUid == null) {
        throw new Error('El número no se encuentra registrado ');
      }

      const contact: Contact = {
        uid: contactUid,
        name,
        phoneNumber: phone
      };

      await this.contactService.addContact(this.uid, contact);

      await loading.dismiss();
      this.contactForm.reset();
      this.router.navigate(['/home']);
      this.toastService.present('Contacto agregado exitosamente', 2000, 'success');
    } catch (err: any) {
      await loading.dismiss();
      this.error = err.message || 'Error al agregar contacto';
      this.toastService.present(this.error, 2000, 'danger');
    }
  }

  get errorControl() {
    return this.contactForm.controls;
  }
}
