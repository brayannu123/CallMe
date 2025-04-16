import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestPasswordPageRoutingModule } from './rest-password-routing.module';

import { RestPasswordPage } from './rest-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RestPasswordPageRoutingModule
  ],
  declarations: [RestPasswordPage]
})
export class RestPasswordPageModule {}
