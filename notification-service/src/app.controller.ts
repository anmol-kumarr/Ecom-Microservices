import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MailerService } from '@nestjs-modules/mailer';


interface NotificationData {
  type: 'otp' | 'order' | 'promotion' | 'payment';
  method: 'email' | 'sms' | 'push';
  recipient: string;
  content: string;
}



@Controller()
export class AppController {
  constructor(private mailService: MailerService, private readonly appService: AppService) { }

  @MessagePattern('notification-otp')
  async sendNotification(@Payload() data: NotificationData) {
    console.log('Received notification data:', data);
    switch (data.type) {
      case 'otp':
        if (data.method === 'email') {
          await this.appService.sendEmailOtp(data.recipient, data.content);
        }
    }
  }
}
