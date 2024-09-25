import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from './Orders.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { UserModule } from '../Users/users.module';
import { User } from '../Users/User.entity';
import { Product } from '../Products/Product.entity';
import { OrderDetails } from '../OrderDetails/OrderDetails.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Orders, User, Product, OrderDetails]),
    UserModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
