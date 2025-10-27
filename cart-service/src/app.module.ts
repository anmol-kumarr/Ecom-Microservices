import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true,
    load:[appConfig],
    envFilePath:'.env'
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
