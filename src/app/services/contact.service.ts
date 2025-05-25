import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
   where,
  deleteDoc,
  updateDoc,
  CollectionReference,
  DocumentData
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Contact } from '../models/contact.model';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private auth: Auth = inject(Auth);

  constructor(private firestore: Firestore) {}


  getContacts(uid: string): Observable<Contact[]> {
    const contactsRef = collection(this.firestore, `users/${uid}/contacts`);
    return (collectionData(contactsRef, { idField: 'uid' }) as Observable<Contact[]>).pipe(
      catchError(error => {
        console.error('Error getting contacts:', error);
        return throwError(() => new Error('Error al obtener contactos'));
      })
    );
  }


  getCurrentUserId(): string {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');
    return user.uid;
  }

  async findUserByPhoneNumber(phone: string): Promise<any | null> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('phone', '==', phone));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { uid: doc.id, ...doc.data() };
    }
    return null;
  }


  async addContact(uid: string, contact: Omit<Contact, 'uid'>): Promise<string> {
    try {
      const contactsRef = collection(this.firestore, `users/${uid}/contacts`);
      const defaultAvatar = 'assets/default-avatar.png';

      const docRef = await addDoc(contactsRef, {
        ...contact,
        photoURL: contact.photoURL || defaultAvatar,
        createdAt: new Date(),
      });


      const contactDoc = doc(this.firestore, `users/${uid}/contacts/${docRef.id}`);
      await updateDoc(contactDoc, { uid: docRef.id });

      return docRef.id;
    } catch (error) {
      console.error('Error adding contact:', error);
      throw new Error('Error al agregar contacto');
    }
  }



  async deleteContact(uid: string, contactId: string): Promise<void> {
    try {
      console.log('UID del usuario:', uid);
      console.log('Eliminando contacto con ID:', contactId);


      const contactDocRef = doc(this.firestore, `users/${uid}/contacts/${contactId}`);


      await deleteDoc(contactDocRef);
      console.log('Contacto eliminado correctamente');
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw new Error('Error al eliminar contacto');
    }
  }



  async updateContact(uid: string, contactId: string, changes: Partial<Contact>): Promise<void> {
    try {
      const contactDoc = doc(this.firestore, `users/${uid}/contacts/${contactId}`);
      await updateDoc(contactDoc, changes);
    } catch (error) {
      console.error('Error updating contact:', error);
      throw new Error('Error al actualizar contacto');
    }
  }


  getContact(uid: string, contactId: string): Observable<Contact | undefined> {
    const contactDoc = doc(this.firestore, `users/${uid}/contacts/${contactId}`);
    return from(getDoc(contactDoc)).pipe(
      map(docSnapshot => {
        if (docSnapshot.exists()) {
          return { uid: docSnapshot.id, ...docSnapshot.data() } as Contact;
        }
        return undefined;
      }),
      catchError(error => {
        console.error('Error getting contact:', error);
        return throwError(() => new Error('Error al obtener contacto'));
      })
    );
  }

  async getContactByPhoneNumber(uid: string, phoneNumber: string): Promise<Contact | undefined> {
    const contactsRef = collection(this.firestore, `users/${uid}/contacts`);
    const q = query(contactsRef, where('phoneNumber', '==', phoneNumber));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { uid: doc.id, ...doc.data() } as Contact;
    }
    return undefined;
  }
  

}
