import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { PrismaService } from './prisma.service.js';

// import { ClientsModule, Transport } from '@nestjs/microservices';
// import { AUTH_SERVICE } from './constant';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [appConfig],
    envFilePath: '.env'
  }),
],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }
