import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
      transform: true,
    }),
  );

  const swaggerOptions = new DocumentBuilder()
    .setTitle('Text Analyzer APIs')
    .setDescription('Text Analyzer APIs')
    .addServer(
      `http://localhost:${configService.get('APP_PORT')}/`,
      'Local development environment',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('docs', app, document);

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  await app.listen(configService.get('APP_PORT'));
}
bootstrap();
