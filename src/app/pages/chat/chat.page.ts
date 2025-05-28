import { MediaService } from './../../services/media.service';
import { User } from '@angular/fire/auth';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { Message } from 'src/app/models/message.model';
import { SupabaseService } from 'src/app/services/supabase.service';
import { AudioService } from 'src/app/services/audio.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone:false,
})
export class ChatPage implements OnInit {
  messages$: Observable<Message[]> = new Observable();
  newMessage: string = '';
  currentUserId: string = '';
  chatId: string = '';
  otherUserId: string = '';
  imageFile: File | null = null;
  imagePreview: string | null = null;

   base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
  }


  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private userService: UserService,
    private mediaService: MediaService,
    private supabaseService: SupabaseService,
     private audioService: AudioService,
  ) {}

   async  ngOnInit () {
    this.otherUserId = this.route.snapshot.paramMap.get('id') || '';
    this.currentUserId = localStorage.getItem('user_id') || '';
    let telefono = "";
     const user = await this.userService.get(this.currentUserId)
     telefono = user.phone


    this.chatService
      .createChat(telefono,this.otherUserId)
      .then((chatId) => {
        this.chatId = chatId;
        this.messages$ = this.chatService.getMessages(chatId);
      });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const message: Message = {
      senderId: this.currentUserId,
      type: 'text',
      content: this.newMessage,

    };

    this.chatService.sendMessage(this.chatId, message);
    this.newMessage = '';
  }

    async pickImage() {
    const imagePath = await this.mediaService.captureImage();
    const response = await fetch(imagePath);
    const blob = await response.blob();
    this.imageFile = new File([blob], `photo_${Date.now()}.jpg`, { type: blob.type });
    const path = `multimedia/${Date.now()}_${this.imageFile.name}`;
    const publicUrl = await this.supabaseService.uploadImage(this.imageFile, path);
    this.enviodeimagen(publicUrl);
  }

    enviodeimagen(content:any) {

    const message: Message = {
      senderId: this.currentUserId,
      type: 'image',
      content: content,

    };

    this.chatService.sendMessage(this.chatId, message);
    this.newMessage = '';
  }

 async pickFile() {
  const file = await this.selectFile();
  if (!file) return;

  const path = `multimedia/${Date.now()}_${file.name}`;
  const publicUrl = await this.supabaseService.uploadImage(file, path);

  this.sendFileMessage(publicUrl, file.name);
}

async selectFile(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*/*';
    input.onchange = () => {
      if (input.files && input.files.length > 0) {
        resolve(input.files[0]);
      } else {
        resolve(null);
      }
    };
    input.click();
  });
}

sendFileMessage(url: string, fileName: string) {
  const message: Message = {
    senderId: this.currentUserId,
    type: 'file',
    content: url,
    fileName: fileName,
  };

  this.chatService.sendMessage(this.chatId, message);
  this.newMessage = '';
}

isRecording: boolean = false;

async recordAndSendAudio() {
  if (!this.isRecording) {
    const hasPermission = await this.audioService.requestPermission();
    if (!hasPermission) {
      alert('Permiso para grabar audio denegado.');
      return;
    }

    await this.audioService.startRecording();
    this.isRecording = true;
    console.log('Grabando...');
  } else {
    const result = await this.audioService.stopRecording();
    this.isRecording = false;
    console.log('Grabación detenida');

    const { recordDataBase64, mimeType } = result.value;
    const audioBlob = this.base64ToBlob(recordDataBase64, mimeType);
    const audioFile = new File([audioBlob], `audio_${Date.now()}.mp3`, { type: mimeType });

    const path = `audio/${Date.now()}_${audioFile.name}`;
    const publicUrl = await this.supabaseService.uploadImage(audioFile, path);

    const message: Message = {
      senderId: this.currentUserId,
      type: 'audio',
      content: publicUrl,
      mimeType: mimeType
    };

    this.chatService.sendMessage(this.chatId, message);
  }
}



}
