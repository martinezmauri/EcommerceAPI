import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { Categories } from './Categories.entity';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async addCategories(): Promise<string> {
    return this.categoriesRepository.addCategories();
  }
  async getCategories(): Promise<Categories[]> {
    return this.categoriesRepository.getCategories();
  }
}
