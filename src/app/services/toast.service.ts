import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastCtrl: ToastController) {}

  async present(message: string, duration: number = 2000, color: string = 'dark') {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      position: 'bottom',
      color,
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });

    await toast.present();
  }
}

