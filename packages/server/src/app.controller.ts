import { Controller, Get, Post, Delete } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('firebase/write')
  async writeHelloWorld() {
    return await this.appService.writeHelloWorld();
  }

  @Get('firebase/read')
  async readHelloWorld() {
    return await this.appService.readHelloWorld();
  }

  @Delete('firebase/delete')
  async deleteHelloWorld() {
    return await this.appService.deleteHelloWorld();
  }
}