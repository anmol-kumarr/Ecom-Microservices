import { Controller, Get, Inject, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from './constant';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(AUTH_SERVICE) private readonly client: ClientProxy,
  ) { }

  @Get(':id')
  async getHello(@Param('id') id: string) {
    
    const result = await firstValueFrom(this.client.send<number>('user-login', id));

    console.log('Result:', result);
    return { id, result };
  }



}
