import { Injectable } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationGateway: NotificationGateway) {}

  async sendNotification(userId: any, title: string, message: string, data: any): Promise<void> {
    // Implement the logic to send notifications via WebSockets
    console.log(userId, title, message, data, 'notification info here')
    this.notificationGateway.sendNotification(userId, title, message, data);
  }
}
