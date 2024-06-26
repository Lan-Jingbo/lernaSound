import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseConfigModule } from './config/firebase.config';

@Module({
  imports: [FirebaseConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}