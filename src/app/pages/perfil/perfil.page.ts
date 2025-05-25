import { Component, OnInit } from '@angular/core';
import { UserService } from '../..//services/user.service';
import { User } from '../../models/user';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone:false,
})
export class PerfilPage implements OnInit {
  user: User | null = null;
  isEditing = false;

  constructor(
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({ message: 'Cargando perfil...' });
    await loading.present();

    this.user = await this.userService.getCurrentUser();

    await loading.dismiss();
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  async guardarCambios() {
    if (!this.user || !this.user.uid) return;

    const loading = await this.loadingCtrl.create({ message: 'Guardando cambios...' });
    await loading.present();

    try {
      await this.userService.update(this.user.uid, {
        nombre: this.user.nombre,
        apellido: this.user.apellido,
        phone: this.user.phone,
      });

      const toast = await this.toastCtrl.create({
        message: 'Perfil actualizado',
        duration: 2000,
        color: 'success',
      });
      await toast.present();
    } catch (error) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'No se pudo guardar el perfil',
        buttons: ['OK'],
      });
      await alert.present();
    }

    await loading.dismiss();
    this.isEditing = false;
  }
}
