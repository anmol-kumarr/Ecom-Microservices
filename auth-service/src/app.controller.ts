import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from './constant';
// import { firstValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(AUTH_SERVICE) private readonly client: ClientProxy,
  ) { }

  @Post('send-otp')
  sendOtp(@Body() reqBody: { email: string, phoneNumber: number }) {
    return this.appService.sendOtp(reqBody)
  }

  @Post('verify-otp')
  verifyOtp(@Body() reqBody:{email:string,phoneNumber:number,otp:string}){
    return this.appService.verifyOtp(reqBody)
  }



}
