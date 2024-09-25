import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // que es?
  app.use(loggerMiddleware);
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ecommerce<martinezmauri>')
    .setDescription(
      'Esta es un ecommerce API construida con NestJS por un proyecto integrador.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();

// Los seeders los va ejecutar unicamente el user admin

// revisar en createUserDto la longitud del name y en createProductDto el tema de la categoria.

// roleguard nose bien que hace

// ApiBody en controller users

// signIn Quizas borrar return y return <Function>

/*  uploadProduct:Un Usuario Administrador, tendrá la posibilidad de actualizar la información de los productos
    cargados en la base de datos así como actualizar stock o agregar imágenes mediante un servicio
    de nube.
 */

// CategoryName por Category_id en productController en createProduct
