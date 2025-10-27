import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailService } from './mail.service';

import { RedisService } from './redis.service';

@Injectable()
export class AppService {



  constructor(private redisService: RedisService, private mailService: MailService) { }

  async sendOtp(sendOtp: { email: string, phoneNumber: number }) {
    try {

      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      const ttl = 1000 * 60 * 2

      await this.redisService.set(sendOtp.email, otp, ttl)

    } catch (err) {
      console.log(err)
      if (err instanceof HttpException) {
        throw new InternalServerErrorException({ statusCode: 500, message: err })
      }
    }
  }



  async verifyOtp(verifyOtp: { email: string, phoneNumber: number, otp: string }) {
    try {
      const otp = await this.redisService.get(verifyOtp.email)
      console.log("otp", otp)
      return {
        otp
      }
    } catch (err) {
      console.log(err)
      if (err instanceof HttpException) {
        throw new InternalServerErrorException({ statusCode: 500, message: err })
      }
    }
  }
}
