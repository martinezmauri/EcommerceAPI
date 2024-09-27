import { Controller, Get, HttpCode } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Categories } from './Categories.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({
    summary: 'Obtener la lista de categorias.',
    description: 'Este endpoint permite obtener la lista de categorias.',
  })
  @ApiResponse({ status: 200, description: 'Lista de categorias.' })
  @HttpCode(200)
  @Get()
  async getCategories(): Promise<Categories[]> {
    return this.categoriesService.getCategories();
  }

  @ApiOperation({
    summary: 'Cargar una lista de categorias.',
    description:
      'Este endpoint permite realizar el "seeding" de categorias en la base de datos.',
  })
  @ApiResponse({
    status: 200,
    description: 'categorías agregadas exitosamente.',
  })
  @ApiResponse({
    status: 200,
    description: 'Todas las categorías ya están cargadas.',
  })
  @ApiResponse({
    status: 200,
    description: 'No se agregaron categorías.',
  })
  @HttpCode(200)
  @Get('seeder')
  async addCategories(): Promise<string> {
    return this.categoriesService.addCategories();
  }
}
