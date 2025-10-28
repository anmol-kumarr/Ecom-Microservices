import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {  NOTIFICATION_SERVICE, USER_SERVICE } from './constant';

import { RedisService } from './redis.service';
import { PrismaService } from './prisma.service';
import { JwtModule } from '@nestjs/jwt';




@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: '.env'
    }),
    ClientsModule.register([
      {
        name: USER_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_MQ_URL || 'amqp://localhost:5042'],
          queue: process.env.USER_QUEUE || 'user_queue',
          queueOptions: { durable: true }
        }
      },
      {
        name: NOTIFICATION_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_MQ_URL || 'amqp://localhost:5042'],
          queue: process.env.NOTIFICATION_QUEUE || 'notification_queue',
          queueOptions: { durable: true }
        }
      }
    ]),
  
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, RedisService, PrismaService],
})
export class AppModule { }
