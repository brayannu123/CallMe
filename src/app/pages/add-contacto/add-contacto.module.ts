import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddContactoPage } from './add-contacto.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    IonicModule,
    RouterModule.forChild([{ path: '', component: AddContactoPage }])
  ],
  declarations: [AddContactoPage]
})
export class AddContactoPageModule {}
