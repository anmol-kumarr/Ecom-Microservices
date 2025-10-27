import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailService } from './mail.service';

import { RedisService } from './redis.service';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {



  constructor(private readonly prismaService: PrismaService, private redisService: RedisService, private mailService: MailService) { }

  async sendOtp(sendOtp: { email: string, phoneNumber: number }) {
    try {

      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      const ttl = 1000 * 60 * 2

      await this.redisService.set(sendOtp.email, otp, ttl)
      await this.mailService.sendOtp(sendOtp.email, otp)

    } catch (err) {
      console.log(err)
      if (err instanceof HttpException) {
        throw new InternalServerErrorException({ statusCode: 500, message: err })
      }
    }
  }



  async verifyOtp(verifyOtp: { email: string, phoneNumber: number, otp: string }) {
    try {

     

      const otp = await this.redisService.get(verifyOtp.email);
      if (Number(otp) !== Number(verifyOtp.otp)) {
        throw new BadRequestException({ message: 'Invalid OTP' });
      }

      if (verifyOtp.email) {
        await this.prismaService.user.create({ data: { email: verifyOtp.email } });
      } else if (verifyOtp.phoneNumber) {
        await this.prismaService.user.create({ data: { mobileNumber: verifyOtp.phoneNumber } });
      } else {
        throw new BadRequestException({ message: 'Email or phone number is required' });
      }



    } catch (err) {
      console.log(err)
      if (err instanceof HttpException) {
        throw new InternalServerErrorException({ statusCode: 500, message: err })
      }
    }
  }
}
