import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '../Auth/guards/AuthGuard';
import { CreateProductDto } from '../dto/CreateProductDto';
import { Role } from '../Auth/enum/roles.enum';
import { Roles } from '../decorators/roles/roles.decorator';
import { RoleGuard } from '../Auth/guards/RoleGuard';
import { Product } from './Product.entity';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @HttpCode(200)
  @Get()
  async getProducts(
    @Query('limit') limit = 5,
    @Query('page') page = 1,
  ): Promise<Product[]> {
    try {
      return this.productsService.getProducts(Number(limit), Number(page));
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error interno. ', error.message);
    }
  }

  @Get('/seeder')
  async addProducts(): Promise<string> {
    try {
      return this.productsService.addProducts();
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error interno. ', error.message);
    }
  }

  @HttpCode(200)
  @Get(':id')
  async getProduct(@Param('id', ParseUUIDPipe) id: string): Promise<Product> {
    try {
      return this.productsService.getProductById(id);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error interno. ', error.message);
    }
  }

  @ApiBody({
    description:
      'Datos para la creacion de un nuevo producto. Debe incluir los campos de DTO CreateProductDto',
    type: CreateProductDto,
  })
  @UseGuards(AuthGuard)
  @HttpCode(201)
  @Post()
  async createProduct(@Body() product: CreateProductDto): Promise<string> {
    try {
      return this.productsService.createProduct(product);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error interno. ', error.message);
    }
  }

  @ApiBody({
    description:
      'Datos parciales para actualizar el producto. Puede incluir uno o más campos del DTO CreateProductDto.',
    type: CreateProductDto,
  })
  @ApiBearerAuth()
  @HttpCode(200)
  @Put(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  async updateProductById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() product: CreateProductDto,
    @Request() req,
  ): Promise<{
    updatedProduct: string;
    exp: Date;
  }> {
    try {
      const updatedProduct = await this.productsService.updateProductById(
        id,
        product,
      );
      return { updatedProduct, exp: req.user.exp };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error interno. ', error.message);
    }
  }

  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteProductById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<string> {
    try {
      return await this.productsService.deleteProductById(id);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error interno. ', error.message);
    }
  }
}
