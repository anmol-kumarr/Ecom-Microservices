import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import type { ClientGrpc } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(@Inject('UPLOAD_SERVICE') private readonly client: ClientGrpc, private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  

  


}
