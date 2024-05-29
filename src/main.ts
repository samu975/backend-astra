import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://astra-ae.co',
      'http://localhost:3000',
      'http://127.0.0.1:5500',
    ],
    methods: 'POST',
    credentials: false,
  });

  await app.listen(4000);
}
bootstrap();
