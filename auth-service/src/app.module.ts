import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from './constant';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
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
        name: AUTH_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_MQ_URL || 'amqp://localhost:5042'],
          queue: process.env.USER_QUEUE || 'user_queue',
          queueOptions: { durable: true }
        }
      }
    ]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        },
        defaults: {
          from: '"No Reply" <noreply@example.com>',
        },
      }

    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, MailService, RedisService, PrismaService],
})
export class AppModule { }
