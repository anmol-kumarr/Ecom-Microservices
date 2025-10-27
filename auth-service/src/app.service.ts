import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailService } from './mail.service';

@Injectable()
export class AppService {

  constructor(private mailService: MailService) { }

  async sendOtp(sendOtp: { email: string, phoneNumber: number }) {
    try {
      console.log(sendOtp)
      await this.mailService.sendOtp(sendOtp.email, "12344")

    } catch (err) {
      console.log(err)
      if (err instanceof HttpException) {
        throw new InternalServerErrorException({ statusCode: 500, message: err })
      }
    }
  }
}
