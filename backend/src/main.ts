import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // CORS — allow Vite frontend on any localhost port
  app.enableCors({
    origin: ['*'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: false,
  });

  // ─── Swagger ────────────────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('SIORT API')
    .setDescription(
      'API REST do Simpósio de Implantes Ortopédicos (SIORT). ' +
        'Gerencia participantes, minicursos, matrículas e certificados.',
    )
    .setVersion('1.0')
    .addTag('participants', 'Inscrição e login de participantes')
    .addTag('courses', 'CRUD de minicursos')
    .addTag('enrollments', 'Matrículas em minicursos (toggle enroll/unenroll)')
    .addTag('certificates', 'Consulta de certificados por e-mail')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
    },
    customSiteTitle: 'SIORT API Docs',
  });
  // ────────────────────────────────────────────────────────────────────

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`🚀 SIORT Backend running on http://localhost:${port}`);
  logger.log(`📚 Swagger UI available at http://localhost:${port}/api`);
}

void bootstrap();
