import { BadRequestException, HttpException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailService } from './mail.service';

import { RedisService } from './redis.service';
import { PrismaService } from './prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from './constant';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AppService {



  constructor(private readonly prismaService: PrismaService,
    private redisService: RedisService,
    private mailService: MailService,
    @Inject(AUTH_SERVICE) private readonly client: ClientProxy,
    private readonly jwtService: JwtService
  ) { }

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



  async verifyOtp(verifyOtp: { email: string, phoneNumber: number, otp: string }, res: Response) {
    try {
      const otp = await this.redisService.get(verifyOtp.email);
      if (Number(otp) !== Number(verifyOtp.otp)) {
        throw new BadRequestException({ message: 'Invalid OTP' });
      }

      if (verifyOtp.email) {

        const checkUser = await this.prismaService.user.findFirst({ where: { email: verifyOtp.email } })

        console.log('checkUser', checkUser)

        if (checkUser) {
          this.generateToken({ email: checkUser?.email || '', sub: checkUser.id }, res);
        } else {
          const data = await this.prismaService.user.create({ data: { email: verifyOtp.email } })
          this.client.emit('user-auth', data);
          this.generateToken({ email: data.email || '', sub: data.id }, res);
        }


      } else if (verifyOtp.phoneNumber) {

        // 

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

  generateToken({ email, sub }: { email: string; sub: number }, res: Response) {
    const payload = { email, sub };

    const token = this.jwtService.signAsync(payload);


    return res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    })

  }
}
