import { BadRequestException, Controller, Get, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Categories } from './Categories.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getCategories(): Promise<Categories[]> {
    try {
      return this.categoriesService.getCategories();
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error interno.', error.message);
    }
  }
  @Get('seeder')
  async addCategories(): Promise<string> {
    try {
      return this.categoriesService.addCategories();
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error interno.', error.message);
    }
  }
}
