import { Body, Controller, Get, Inject, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';

import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { USER_SERVICE } from './constant';

// import { firstValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(USER_SERVICE) private readonly client: ClientProxy,
    private readonly jwtService: JwtService
  ) { }


  @Get()
  getHello() {
    return 'Auth Service is running';
    
    };

    


  @Post('send-otp')
  sendOtp(@Body() reqBody: { email: string, phoneNumber: number }) {
    return this.appService.sendOtp(reqBody)
  }

  @Post('verify-otp')
  verifyOtp(@Body() reqBody: { email: string, phoneNumber: number, otp: string }, @Res({ passthrough: true }) res: Response) {
    return this.appService.verifyOtp(reqBody, res)
  }



}
