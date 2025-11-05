import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';


async function bootstrap() {
  const appName = 'Product-service';
  const logger  =new Logger(appName)
  const app = await NestFactory.create(AppModule,{logger});
  


  await app.listen(process.env.PORT ?? 3000);
  logger.log(`${appName} successfully started on port ${process.env.PORT}`);
}
bootstrap();
