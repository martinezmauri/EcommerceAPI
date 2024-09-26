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
    return this.categoriesService.getCategories();
  }
  @Get('seeder')
  async addCategories(): Promise<string> {
    return this.categoriesService.addCategories();
  }
}
