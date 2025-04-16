import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private firestore: AngularFirestore, private auth: Auth) {}

  async registerPush() {
    if (Capacitor.isNativePlatform()) {
      let permStatus = await PushNotifications.checkPermissions();
      if (permStatus.receive !== 'granted') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive === 'granted') {
        await PushNotifications.register();

        PushNotifications.addListener('registration', async (token) => {
          console.log('FCM Token:', token.value);
          const user = this.auth.currentUser;
          await this.saveTokenToFirestore(user.uid, token.value);
        });

        PushNotifications.addListener('registrationError', (err) => {
          console.error('Registration error:', err);
        });
      }
    }
  }

  private saveTokenToFirestore(userId: string, token: string) {
    return this.firestore.collection('users').doc(userId).update({ token });
  }
}
