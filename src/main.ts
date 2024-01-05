import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import helmet from 'helmet';

async function bootstrap() {
  const logger = WinstonModule.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [new winston.transports.Console()],
  });

  const app = await NestFactory.create(AppModule, { logger });

  app.enableCors({
    origin: '*',
  });

  app.use(helmet());

  const options = new DocumentBuilder()
    .setTitle('Library Management System APIs')
    .setDescription('Back End for Library Management System')
    .setVersion('1.0.0')
    .addBearerAuth({
      description: `[just text field] Please enter token in following format: Bearer <JWT>`,
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Base Swagger API',
  });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, skipMissingProperties: true }),
  );
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
