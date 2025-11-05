import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { PrismaService } from './prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [appConfig],
    envFilePath: '.env'
  }),
  ClientsModule.register([
    {
      name: 'UPLOAD_SERVICE',
      transport: Transport.GRPC,
      options: {
        package: 'upload',
        protoPath: join(__dirname, './../../proto/upload.proto'),
      },
    },
  ])],
  controllers: [AppController],
  providers: [AppService, PrismaService]
})
export class AppModule { }
