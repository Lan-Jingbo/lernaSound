// src/app.module.ts
import { Module } from '@nestjs/common';
import { FirebaseConfigModule } from './config/firebase.config';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [AppModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}