import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-call',
  templateUrl: './call.page.html',
  styleUrls: ['./call.page.scss'],
  standalone:false
})
export class CallPage implements OnInit {
  callData: any;

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



  acceptCall() {
    const room = this.callData.meetingId;
    window.open(`https://jitsi1.geeksec.de/${room}`, '_blank');
  }


  rejectCall() {
   
    alert('Llamada rechazada');
  }
}
