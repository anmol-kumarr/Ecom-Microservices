import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }


  @Get()
  first() {
    return 'hello world'
  }

  @MessagePattern('user-login')
  handleUserLogin(@Payload() data: string) {
    console.log('Received data:', data);
    const num = Number(data);
    return num + 1;
  }
}
