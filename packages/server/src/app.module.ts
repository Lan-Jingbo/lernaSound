import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AudioController } from './audio/audio.controller';
import { ConfigModule } from '@nestjs/config';
import { Module, MiddlewareConsumer } from '@nestjs/common';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, AudioController],
  providers: [AppService],
})
export class AppModule {}
