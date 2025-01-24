import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  const config = new DocumentBuilder()
    .setTitle('Median')
    .setDescription('The Median API description')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const logger = new Logger(bootstrap.name);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3210);

  logger.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3210}`,
  );
  logger.log(
    `Swagger is running on: http://localhost:${process.env.PORT ?? 3210}/api`,
  );
}

bootstrap();
