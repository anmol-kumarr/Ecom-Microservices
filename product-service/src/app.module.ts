import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal:true,
      load:[appConfig],
      envFilePath:'.env'
    })],
  controllers: [AppController],
  providers: [AppService,PrismaService]
})
export class AppModule {}
