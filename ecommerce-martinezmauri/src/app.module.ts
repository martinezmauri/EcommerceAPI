import { Module } from '@nestjs/common';
import { UserModule } from './Users/users.module';
import { ProductsModule } from './Products/products.module';
import { AuthModule } from './Auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoriesModule } from './Categories/categories.module';
import { OrdersModule } from './Orders/orders.module';
import typeOrmConfig from './config/typeorm.config';
import { FileUploadModule } from './file-upload/file-upload.module';
import { cloudinaryConfig } from './config/cloudinary.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
      secret: process.env.JWT_SECRET,
    }),
    UserModule,
    ProductsModule,
    CategoriesModule,
    AuthModule,
    OrdersModule,
    FileUploadModule,
  ],
  controllers: [],
  providers: [cloudinaryConfig],
})
export class AppModule {}
