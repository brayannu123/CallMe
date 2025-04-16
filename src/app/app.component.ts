import { Component } from '@angular/core';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private notificationService: NotificationService) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.notificationService.registerPush();
  }
}

