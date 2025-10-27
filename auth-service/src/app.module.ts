import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import appConfig from './config/app.config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true,
    load:[appConfig],
    envFilePath:'.env'
  }), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
