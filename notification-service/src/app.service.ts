import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private mailService: MailerService) { }

  async sendEmailOtp(email: string, otp: string) {
    await this.mailService.sendMail({
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is: ${otp}`,     // plain text
      html: `<b>Your OTP is: ${otp}</b>`, // HTML
    });
  }
}
