import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Contact } from 'src/app/models/contact.model';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  standalone:false
})
export class ContactFormComponent {

  @Input() contact: Contact = { uid: '', name: '', phoneNumber: '' };
  @Input() isEdit: boolean = false;
  @Output() submitContact = new EventEmitter<Contact>();

  onSubmit() {
    this.submitContact.emit(this.contact);
  }
}
