import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: 'upload',
      protoPath: join(__dirname, '../proto/upload.proto'),
      url: 'localhost:50051',
    },
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
