import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddContactoPage } from './add-contacto.page';

const routes: Routes = [
  {
    path: '',
    component: AddContactoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddContactoPageRoutingModule {}
