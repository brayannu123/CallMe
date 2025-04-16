import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ContactItemComponent } from './components/contact-item/contact-item.component';

@NgModule({
  declarations: [
    ContactItemComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    ContactItemComponent
  ]
})
export class SharedComponentsModule {}
