import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthenticationService } from '../../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rest-password',
  templateUrl: './rest-password.page.html',
  styleUrls: ['./rest-password.page.scss'],
  standalone: false,
})
export class RestPasswordPage implements OnInit {
  resetPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {}

  async resetPassword() {
    if (this.resetPasswordForm.valid) {
      const { email } = this.resetPasswordForm.value;
      const loading = await this.loadingCtrl.create({
        message: 'Enviando correo de restablecimiento...',
      });
      await loading.present();

      try {
        await this.authService.forgotPassword(email);
        await loading.dismiss();
        this.presentToast('Se ha enviado un correo electrónico a su dirección para restablecer su contraseña.');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
        
      } catch (error: any) {
        await loading.dismiss();
        let message = 'Error al enviar el correo de restablecimiento.';
        if (error.code === 'auth/user-not-found') {
          message = 'No hay ninguna cuenta de usuario con este correo electrónico.';
        } else if (error.code === 'auth/invalid-email') {
          message = 'La dirección de correo electrónico no es válida.';
        }
        this.presentToast(message);
      }
    } else {
      this.presentToast('Por favor, introduce tu correo electrónico.');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
    });
    await toast.present();
  }
}
