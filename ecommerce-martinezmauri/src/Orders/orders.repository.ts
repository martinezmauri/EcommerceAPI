import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Orders } from './Orders.entity';
import { In, MoreThan, Repository } from 'typeorm';
import { User } from '../Users/User.entity';
import { Product } from '../Products/Product.entity';
import { OrderDetails } from '../OrderDetails/OrderDetails.entity';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(OrderDetails)
    private readonly orderDetailsRepository: Repository<OrderDetails>,
  ) {}

  async getOrder(id: string) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!order) {
      throw new NotFoundException('No existe una order para ese id.');
    }
    const orderDetail = await this.orderDetailsRepository.findOne({
      where: { order: order },
      relations: ['products'],
    });

    if (!orderDetail) {
      throw new NotFoundException('No existe un detalle para la orden.');
    }

    return {
      order,
      orderDetail,
    };
  }

  async addOrder(userId: string, productsIds: string[]) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`user con id ${userId} no existe.`);
    }
    const products = await this.productRepository.findBy({
      id: In(productsIds),
      stock: MoreThan(0),
    });
    if (products.length === 0) {
      throw new NotFoundException('No hay productos con stock mayor a 0');
    }
    let total = 0;
    products.forEach((product) => {
      const price = parseFloat(product.price.toString().replace(/,/g, ''));
      if (isNaN(price)) {
        throw new BadRequestException('El producto tiene un precio invalido');
      }
      total += price;
      product.stock -= 1;
    });
    await this.productRepository.save(products);
    total = parseFloat(total.toString().replace(/,/g, ''));
    if (isNaN(total)) {
      throw new InternalServerErrorException(`Total calculado inválido.`);
    }

    const order = new Orders();
    order.date = new Date();
    order.user = user;
    const savedOrder = await this.ordersRepository.save(order);

    const orderDetail = new OrderDetails();
    orderDetail.order = savedOrder;
    orderDetail.price = total;
    orderDetail.products = products;
    await this.orderDetailsRepository.save(orderDetail);

    savedOrder.orderDetail = orderDetail;
    await this.ordersRepository.save(savedOrder);

    return {
      savedOrder,
      orderDetail,
    };
  }
}
