import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 4000;
  const nodeEnv = configService.get<string>('nodeEnv') || 'development';
  const corsOrigins = configService.get<string[]>('cors.origins') || ['*'];

  // Sécurité HTTP
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: corsOrigins.includes('*') ? true : corsOrigins,
    credentials: true,
  });

  // Préfixe global pour toutes les routes de l'API
  app.setGlobalPrefix('api/v1', {
    exclude: ['health', 'docs'],
  });

  // Validation automatique des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Filtres et Intercepteurs globaux
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  // Documentation interactive Swagger / OpenAPI
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Inventa Backend API')
    .setDescription('Documentation officielle de l’API REST d’Inventa (Gems Flow Suite) - Bayecode Tech')
    .setVersion('1.0.0')
    .addTag('Santé & Système')
    .addTag('Abonnements & Relances')
    .addTag('Paiements & Webhooks')
    .addTag('Inventaire & Bijoux')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Inventa API - Documentation Swagger',
  });

  await app.listen(port);

  logger.log(`
=================================================================
🚀 INVENTA API (NestJS Enterprise Architecture) DÉMARRÉE !
=================================================================
📡 URL Principale      : http://localhost:${port}
🩺 Santé / Health Check : http://localhost:${port}/health
📚 Documentation Swagger: http://localhost:${port}/docs
🔒 Environnement       : ${nodeEnv}
🌍 Origines CORS        : ${corsOrigins.join(', ')}
=================================================================
  `);
}

bootstrap();
