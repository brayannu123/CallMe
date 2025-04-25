
import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, User, getAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private auth: Auth = inject(Auth);

  async registerUser(email: string, password: string) {
    return await createUserWithEmailAndPassword(this.auth, email, password);
  }

  async loginUser(email: string, password: string) {
    console.log("el problema",email, password)
    return await signInWithEmailAndPassword(this.auth, email, password);

  }

  async forgotPassword(email: string) {
    return await sendPasswordResetEmail(this.auth, email);
  }

  async singOUT() {
    return await signOut(this.auth);
  }

  async getProfile(): Promise<User | null> {
    return this.auth.currentUser;
  }
}

