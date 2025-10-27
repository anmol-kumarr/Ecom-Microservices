import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {  Transport } from '@nestjs/microservices';


async function bootstrap() {
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [''],
  //     queue: 'auth_queue',
  //     queueOptions: {
  //       durable: true
  //     }
  //   }
  // });
  // await app.startallmicr

  // const logger=new Logger()

  // logger.log(`User server is running`)



  const app = await NestFactory.create(AppModule)
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBIT_MQ_URL],
      queue: 'user_queue',
      queueOptions: {
        durable: true
      }
    }
  })

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3002);

}
bootstrap();
