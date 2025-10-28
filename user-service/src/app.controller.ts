import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { PrismaService } from './prisma.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly prisma: PrismaService) { }


  @Get()
  first() {
    return 'hello world'
  }
  

  @MessagePattern('user-created')
  async handleUserCreation(@Payload() data: { id: number, email: string, password: string, mobileNumber: number }) {
    console.log('Received user-created event:', data);
    await this.prisma.user.create({
      data: {
        id: data.id,
        email: data.email,
        phoneNumber: data.mobileNumber
      }
    });

  }
}
