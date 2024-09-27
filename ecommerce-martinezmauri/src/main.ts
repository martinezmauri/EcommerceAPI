import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(loggerMiddleware);
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ecommerce<martinezmauri>')
    .setDescription(
      'Esta API permite gestionar un sistema de ecommerce, brindando funcionalidades para la creación, actualización y eliminación de usuarios, productos y órdenes. Además, proporciona mecanismos de autenticación y autorización basados en roles, garantizando seguridad en el acceso a los recursos.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
