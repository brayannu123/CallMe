import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import {Capacitor} from "@capacitor/core";

@Component({
  selector: 'app-call',
  templateUrl: './call.page.html',
  styleUrls: ['./call.page.scss'],
  standalone:false
})
export class CallPage implements OnInit {
  callData: any;
  meetingId: string = '';


  constructor(
    private route: ActivatedRoute,
    private callService: NotificationService
  ) {}

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      if (params && params['callData']) {
        this.callData = JSON.parse(params['callData']);
      }
    });
  }



  async acceptCall() {
    if (Capacitor.getPlatform() !== 'android') {
      console.warn('Esta función solo está disponible en Android.');
      return;
    }

    try {
      console.log('🚀 Aceptando llamada:', this.meetingId, this.callData);
      await (window as any).Capacitor.Plugins.ExamplePlugin.startCall({
        meetingId: this.meetingId,
        userName: this.callData
      });
    } catch (error) {
      console.error('❌ Error al lanzar la llamada:', error);
    }
  }



  rejectCall() {

    alert('Llamada rechazada');
  }
}
