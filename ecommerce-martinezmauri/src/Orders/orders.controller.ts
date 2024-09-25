import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from '../dto/CreateOrderDto';
import { AuthGuard } from '../Auth/guards/AuthGuard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthGuard)
  async getOrder(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    try {
      const { order, orderDetail } = await this.ordersService.getOrder(id);
      const { isAdmin, password, ...userWithoutPassword } = order.user;
      return {
        user: userWithoutPassword,
        order: {
          id: order.id,
          date: order.date,
        },
        orderDetails: {
          id: orderDetail.id,
          total: orderDetail.price,
          products: orderDetail.products,
        },
        exp: req.user.exp,
      };
    } catch (error) {
      console.error(error.message);
      throw new BadRequestException('Error interno. ', error.message);
    }
  }

  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard)
  async addOrder(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    try {
      const { savedOrder, orderDetail } =
        await this.ordersService.addOrder(createOrderDto);
      return {
        id: savedOrder.id,
        date: savedOrder.date,
        userId: savedOrder.user.id,
        orderDetail: {
          id: orderDetail.id,
          price: orderDetail.price,
          products: orderDetail.products.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
          })),
        },
        exp: req.user.exp,
      };
    } catch (error) {
      console.error(error.message);
      throw new BadRequestException('Error interno. ', error.message);
    }
  }
}
