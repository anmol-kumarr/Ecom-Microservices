import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @GrpcMethod('UploadService', 'UploadFile')
  uploadFile(data: { filename: string; content: Buffer }): { message: string } {
    // Handle file upload logic here
    console.log(`Received file: ${data.filename}, size: ${data.content.length} bytes`);
    return { message: `File ${data.filename} uploaded successfully.` };
  }
}
