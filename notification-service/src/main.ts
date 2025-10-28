import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBIT_MQ_URL || 'amqp://localhost:5672'],
      queue: 'notification_queue',
      queueOptions: {
        durable: true
      }
    }
  });
  await app.listen();
}
bootstrap();
