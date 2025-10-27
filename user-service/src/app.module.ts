import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
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
  providers: [AppService],
})
export class AppModule { }
