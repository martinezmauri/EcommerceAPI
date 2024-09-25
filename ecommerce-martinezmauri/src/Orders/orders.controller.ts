import {
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
    const order = await this.ordersService.getOrder(id);
    return { order, exp: req.user.exp };
  }

  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard)
  async addOrder(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    const orderAdd = await this.ordersService.addOrder(createOrderDto);
    return { orderAdd, exp: req.user.exp };
  }
}
