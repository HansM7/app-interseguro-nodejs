import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLogger } from './config/logger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });



  app.setGlobalPrefix("api/v1");

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }));

  const config = new DocumentBuilder()
    .setTitle('Interseguro Challenge API')
    .setDescription('API for rotating matrices and calculating statistics, built with strict Hexagonal Architecture via hexa-mod.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);


  app.enableCors({
    origin: 'https://app-interseguro-frontend.vercel.app',
    credentials: true,
  });

  const PORT = process.env.PORT || 4000;
  await app.listen(PORT);
}
bootstrap();
