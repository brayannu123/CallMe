import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  collectionData,
  serverTimestamp,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable, from, map } from 'rxjs';
import { Message } from '../models/message.model';
import { getDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  private generateChatId(userId1: string, userId2: string): string {
    return [userId1, userId2].sort().join('_');
  }
   async createChat(userId1: string, userId2: string): Promise<string> {
    const chatId = this.generateChatId(userId1, userId2);
    console.log("Barcelona" + userId1)
    const chatRef = doc(this.firestore, `chats/${chatId}`);
    const snapshot = await getDoc(chatRef);

    if (!snapshot.exists()) {
      await setDoc(chatRef, {
        users: [userId1, userId2],
        lastMessage: '',
        updatedAt: serverTimestamp(),
      });
    }

    return chatId;
  }

  listenToMessages(chatId: string): Observable<Message[]> {
    const messagesRef = collection(this.firestore, `chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Message[]>;
  }


  sendMessage(chatId: string, message: Message): Promise<void> {
    const messagesCollection = collection(this.firestore, 'chats', chatId, 'messages');
    return addDoc(messagesCollection, {
      ...message,
      timestamp: serverTimestamp(),
    }).then(() => {
      const chatDocRef = doc(this.firestore, 'chats', chatId);
      return setDoc(chatDocRef, {
        lastMessage: message.type === 'text' ? message.content : message.type,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    });
  }

  getMessages(chatId: string): Observable<Message[]> {
    const messagesCollection = collection(this.firestore, 'chats', chatId, 'messages');
    const messagesQuery = query(messagesCollection, orderBy('timestamp', 'asc'));
    return collectionData(messagesQuery, { idField: 'id' }) as Observable<Message[]>;
  }
}
