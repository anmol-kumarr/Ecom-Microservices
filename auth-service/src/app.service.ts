import { BadRequestException, HttpException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';


import { RedisService } from './redis.service';
import { PrismaService } from './prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import {  NOTIFICATION_SERVICE, USER_SERVICE } from './constant';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AppService {



  constructor(private readonly prismaService: PrismaService,
    private redisService: RedisService,
    @Inject(USER_SERVICE) private readonly userClient: ClientProxy,
    @Inject(NOTIFICATION_SERVICE) private readonly notificationClient: ClientProxy,
    private readonly jwtService: JwtService
  ) { }

  sendOtp(sendOtp: { email: string, phoneNumber: number }) {
    try {

      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      const ttl = 1000 * 60 * 2

      this.redisService
        .set(sendOtp.email, otp, ttl)
        .catch(err => console.error('Redis set error:', err));


      this.notificationClient.emit("notification-otp", { type: 'otp', method: 'email', recipient: sendOtp.email, content: otp });

      return { message: 'OTP sent successfully' }

    } catch (err) {
      console.log(err)
      if (err instanceof HttpException) {
        throw new InternalServerErrorException({ statusCode: 500, message: err })
      }
    }
  }



  async verifyOtp(verifyOtp: { email: string, phoneNumber: number, otp: string }, res: Response) {
    try {

      if (!verifyOtp.email && !verifyOtp.phoneNumber) {
        throw new BadRequestException({ message: 'Email or phone number is required' });
      }

      const otp = await this.redisService.get(verifyOtp.email);
      if (Number(otp) !== Number(verifyOtp.otp)) {
        throw new BadRequestException({ message: 'Invalid OTP' });
      }

      if (verifyOtp.email) {

        const checkUser = await this.prismaService.user.findFirst({ where: { email: verifyOtp.email } })



        if (checkUser) {
          await this.generateToken({ email: checkUser?.email || '', sub: checkUser.id }, res);
        } else {
          const data = await this.prismaService.user.create({ data: { email: verifyOtp.email } })
          this.userClient.emit('user-created', data);
          await this.generateToken({ email: data.email || '', sub: data.id }, res);
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

  async generateToken({ email, sub }: { email: string; sub: number }, res: Response) {
    const payload = { email, sub };

    const token = await this.jwtService.signAsync(payload);


    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    })

    return { message: 'Token generated successfully' };

  }
}
