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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({
    summary: 'Obtener una orden de compra.',
    description:
      'Este endpoint permite obtener una orden de compra buscada por ID con los detalles de la compra y del usuario. Es necesario un token válido.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Orden de compra buscada por ID. Con informacion del usuario, detalles y tiempo de expiracion de token.',
  })
  @ApiResponse({
    status: 404,
    description: 'No existe una order para ese id.',
  })
  @ApiResponse({
    status: 404,
    description: 'No existe un detalle para la orden.',
  })
  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthGuard)
  async getOrder(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
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
  }

  @ApiOperation({
    summary: 'Crear una orden de compra.',
    description:
      'Este endpoint crea una orden de compra. Es necesario un token válido.',
  })
  @ApiBody({
    description: 'Datos para la creación de una orden de compra.',
    type: CreateOrderDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Orden de compra y tiempo de expiracion de token.',
  })
  @ApiResponse({ status: 404, description: 'Usuario no existe.' })
  @ApiResponse({
    status: 404,
    description: 'No hay productos con stock mayor a 0',
  })
  @ApiResponse({
    status: 400,
    description: 'El producto tiene un precio invalido',
  })
  @ApiResponse({
    status: 500,
    description: 'Total calculado inválido.',
  })
  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard)
  async addOrder(@Body() createOrderDto: CreateOrderDto, @Request() req) {
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
  }
}
