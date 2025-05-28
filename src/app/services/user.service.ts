import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  DocumentReference,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  private userRef(uid: string): DocumentReference {
    return doc(this.firestore, 'users', uid);
  }

  async create(user: User): Promise<void> {
    if (!user.uid) throw new Error('UID requerido para crear el usuario');
    await setDoc(this.userRef(user.uid), user);
  }

  async get(uid: string): Promise<User | undefined> {
    const snapshot = await getDoc(this.userRef(uid));
    return snapshot.exists() ? (snapshot.data() as User) : undefined;
  }

  async update(uid: string, data: Partial<Omit<User, 'uid'>>): Promise<void> {
    await updateDoc(this.userRef(uid), data);
  }

  async delete(uid: string): Promise<void> {
    await deleteDoc(this.userRef(uid));
  }

  async getAll(): Promise<User[]> {
    const usersSnap = await getDocs(collection(this.firestore, 'users'));
    return usersSnap.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User));
  }

  async findUserByPhoneNumber(phone: string): Promise<User | null> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('phone', '==', phone));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { uid: doc.id, ...doc.data() } as User;
    }

    return null;
  }

  async addUserToken(uid: string, token: string): Promise<void> {
    await updateDoc(this.userRef(uid), { token });
  }

async getCurrentUser(): Promise<User | null> {
  const currentUser = this.auth.currentUser;  
  if (!currentUser) return null;

  const user = await this.get(currentUser.uid);
  return user || null;
}

}
