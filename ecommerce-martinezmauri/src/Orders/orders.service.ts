import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrderDto } from 'src/dto/CreateOrderDto';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async getOrder(id: string) {
    return this.ordersRepository.getOrder(id);
  }

  async addOrder(dataOrder: CreateOrderDto) {
    const { userId, products } = dataOrder;
    const productsIds = products.map((product) => product.id);
    return this.ordersRepository.addOrder(userId, productsIds);
  }
}
