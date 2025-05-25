import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { AuthenticationService } from '../../authentication.service';
import { ToastService } from 'src/app/services/toast.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  isAndroid: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loadingCtrl: LoadingController,
    private authService: AuthenticationService,
    private toastService: ToastService,
    private platform: Platform
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.isAndroid = this.platform.is('android');
  }

  ngOnInit() {
    this.checkAuthState();
  }

  async checkAuthState() {
    try {
      const user = await this.authService.getProfile();
      if (user) {
        this.router.navigate(['/home']);
      }
    } catch {
      console.log('No hay usuario autenticado');
    }
  }

  async login() {
    if (!this.loginForm.valid) {
      this.toastService.present('Por favor, completa correctamente todos los campos.', 3000, 'danger');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent',
      backdropDismiss: false,
    });

    try {
      await loading.present();

      const { email, password } = this.loginForm.value;
      console.log('Intento de login en plataforma:', this.isAndroid ? 'Android' : 'Web');

      const userCredential = await this.authService.loginUser(email, password);
      console.log('Login exitoso:', userCredential);

     localStorage.setItem('user_id',userCredential.user.uid);
     console.log("hola mundo");

      await loading.dismiss();
      this.router.navigate(['/home'], { replaceUrl: true });

    } catch (error: any) {
      console.error('Error completo en login:', error);
      await loading.dismiss();

      const errorMessages: { [code: string]: string } = {
        'auth/invalid-email': 'El formato del correo electrónico no es válido.',
        'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
        'auth/user-not-found': 'No existe una cuenta con este correo electrónico.',
        'auth/wrong-password': 'La contraseña es incorrecta.',
        'auth/network-request-failed': 'Error de conexión. Verifica tu conexión a internet.',
        'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde.',
      };

      const message = error.code
        ? errorMessages[error.code] || `Error: ${error.code}`
        : 'Error al iniciar sesión.';

      this.toastService.present(message, 3000, 'danger');
    }
  }

  get errorControl() {
    return this.loginForm.controls;
  }
}

