import {
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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({
    summary: 'Obtener la lista de productos.',
    description:
      'Este endpoint permite obtener una lista de productos. Puedes agregar parámetros de consulta (queries) como "page" y "limit" para paginar los resultados.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos.',
  })
  @HttpCode(200)
  @Get()
  async getProducts(
    @Query('limit') limit = 5,
    @Query('page') page = 1,
  ): Promise<Product[]> {
    return this.productsService.getProducts(Number(limit), Number(page));
  }

  @ApiOperation({
    summary: 'Cargar una lista de productos.',
    description:
      'Este endpoint permite realizar el "seeding" de productos en la base de datos. Para ejecutar este proceso, las categorías deben estar cargadas previamente.',
  })
  @ApiResponse({ status: 200, description: 'Productos agregados.' })
  @ApiResponse({
    status: 400,
    description: 'Primero debe cargar las categorías.',
  })
  @ApiResponse({
    status: 409,
    description: 'Los productos ya se encuentran cargados.',
  })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada.' })
  @Get('/seeder')
  async addProducts(): Promise<string> {
    return this.productsService.addProducts();
  }

  @ApiOperation({
    summary: 'Obtener información de un producto.',
    description:
      'Este endpoint permite obtener información de un producto buscado por su ID.',
  })
  @ApiResponse({ status: 200, description: 'Producto encontrado.' })
  @ApiResponse({
    status: 404,
    description: 'No existe un usuario para ese id.',
  })
  @HttpCode(200)
  @Get(':id')
  async getProduct(@Param('id', ParseUUIDPipe) id: string): Promise<Product> {
    return this.productsService.getProductById(id);
  }

  @ApiOperation({
    summary: 'Crear un nuevo producto.',
    description:
      'Este endpoint permite crear un nuevo producto. Es necesario un token válido.',
  })
  @ApiBody({
    description:
      'Datos para la creación de un nuevo producto. Debe incluir los campos del DTO CreateProductDto.',
    type: CreateProductDto,
  })
  @ApiResponse({ status: 201, description: 'ID del producto actualizado.' })
  @ApiResponse({ status: 404, description: `Categoría no encontrada.` })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(201)
  @Post()
  async createProduct(@Body() product: CreateProductDto): Promise<string> {
    return this.productsService.createProduct(product);
  }

  @ApiOperation({
    summary: 'Actualizar información de un producto.',
    description:
      'Este endpoint permite actualizar la información de un producto buscado por su ID. Es necesario un token válido con rol de administrador.',
  })
  @ApiBody({
    description:
      'Datos para actualizar el producto. Puede incluir uno o más campos del DTO CreateProductDto.',
    type: CreateProductDto,
  })
  @ApiResponse({
    status: 200,
    description: 'ID del producto actualizado y tiempo de expiracion de token.',
  })
  @ApiResponse({
    status: 404,
    description: `El producto con ID no encontrado`,
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
    const updatedProduct = await this.productsService.updateProductById(
      id,
      product,
    );
    return { updatedProduct, exp: req.user.exp };
  }

  @ApiOperation({
    summary: 'Borrar un producto.',
    description:
      'Este endpoint permite eliminar un producto buscado por su ID. Es necesario un token válido.',
  })
  @ApiResponse({ status: 200, description: 'ID del producto eliminado.' })
  @ApiResponse({ status: 404, description: 'El producto no existe.' })
  @ApiBearerAuth()
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteProductById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<string> {
    return await this.productsService.deleteProductById(id);
  }
}
