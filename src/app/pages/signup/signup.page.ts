import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false,
})
export class SignupPage implements OnInit {
  regForm: FormGroup;
  auth: Auth = inject(Auth);
  firestore: Firestore = inject(Firestore);

  constructor(
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private router: Router,
    private toastService: ToastService
  ) {
    this.regForm = this.fb.group({
      fullname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern('(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}'),
        ],
      ],
      phone: ['', [Validators.pattern('^[0-9]*$'), Validators.minLength(7)]],
    });
  }

  ngOnInit() {}

  get errorControl() {
    return this.regForm.controls;
  }

  async signUp() {
    const loading = await this.loadingCtrl.create({
      message: 'Creando cuenta...',
    });
    await loading.present();

    if (this.regForm.valid) {
      const { fullname, email, password, phone } = this.regForm.value;
      try {
        const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
        if (userCredential?.user) {
          const usersCollection = collection(this.firestore, 'users');
          const userDocRef = doc(usersCollection, userCredential.user.uid);
          await setDoc(userDocRef, {
            uid: userCredential.user.uid,
            fullname: fullname,
            email: email,
            phone: phone || null,
          });
          await loading.dismiss();
          this.toastService.present('Cuenta creada exitosamente.', 3000, 'success');
          this.router.navigate(['/login']);
        }
      } catch (error: any) {
        console.error('Error al crear la cuenta:', error);

        const errorMessages: { [code: string]: string } = {
          'auth/email-already-in-use': 'Este correo electrónico ya está en uso.',
          'auth/invalid-email': 'El correo electrónico no es válido.',
          'auth/weak-password': 'La contraseña debe tener al menos 8 caracteres y contener al menos una mayúscula, una minúscula y un número.',
        };

        const message = error.code
          ? errorMessages[error.code] || 'Error al crear la cuenta.'
          : 'Error al crear la cuenta.';

        this.toastService.present(message, 3000, 'danger');
        await loading.dismiss();
      }
    } else {
      await loading.dismiss();
      this.toastService.present('Por favor, completa todos los campos correctamente.', 3000, 'danger');
    }
  }
}

