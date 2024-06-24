// src/firebase/firebase.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('firebase')
export class AppController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Get('test')
  async testConnection() {
    return await this.firebaseService.testConnection();
  }
}