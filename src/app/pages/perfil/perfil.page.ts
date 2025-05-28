import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { AlertController, LoadingController } from '@ionic/angular';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit {
  user: User | null = null;
  isEditing = false;

  constructor(
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastService: ToastService,
    private auth: Auth,           
    private router: Router
  ) {}

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({ message: 'Cargando perfil...' });
    await loading.present();

    try {
      this.user = await this.userService.getCurrentUser();
      console.log('Usuario cargado:', this.user);
    } catch (error) {
      console.error('Error al cargar el usuario:', error);
    }

    await loading.dismiss();
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    console.log('Modo edición:', this.isEditing);
  }

  async guardarCambios() {
    if (!this.user || !this.user.uid) {
      console.warn('Usuario no válido para guardar cambios:', this.user);
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Guardando cambios...' });
    await loading.present();

    try {
      console.log('Datos a guardar:', {
        uid: this.user.uid,
        fullname: this.user.fullname,
        phone: this.user.phone,
      });

      await this.userService.update(this.user.uid, {
        fullname: this.user.fullname,
        phone: this.user.phone,
      });

      await this.toastService.present('Perfil actualizado', 2000, 'success');
    } catch (error) {
      console.error('Error al guardar cambios:', error);
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

  async cerrarSesion() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro de que deseas salir?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Salir',
          role: 'destructive',
          handler: async () => {
            await this.auth.signOut();
            this.router.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }
}

