// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// //import { ConfigModule } from '@nestjs/config';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.enableCors();
//   await app.listen(3001);
// }
// bootstrap();

import app from './app';
import appConfig from './config/app';

const PORT = appConfig.port;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});