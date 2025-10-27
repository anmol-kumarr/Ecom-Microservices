import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }

    async sendOtp(email: string, otp: string) {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP is: ${otp}`,     // plain text
            html: `<b>Your OTP is: ${otp}</b>`, // HTML
        });
    }
}
