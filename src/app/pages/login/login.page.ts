import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthenticationService } from '../../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthenticationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  async login() {
    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
    });
    await loading.present();

    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      try {
        await this.authService.loginUser(email, password); 
        await loading.dismiss();
        this.router.navigate(['/home']);
      } catch (error: any) {
        console.error('Error al iniciar sesión:', error);
        let message = 'Error al iniciar sesión.';
        if (error.code === 'auth/invalid-email') {
          message = 'El correo electrónico no es válido.';
        } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          message = 'Credenciales incorrectas.';
        }
        this.presentToast(message);
        await loading.dismiss();
      }
    } else {
      this.presentToast('Por favor, introduce tu correo electrónico y contraseña.');
      await loading.dismiss();
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  get errorControl() {
    return this.loginForm.controls;
  }
}

