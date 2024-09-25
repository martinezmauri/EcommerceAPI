import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from './Categories.entity';
import { Repository } from 'typeorm';
import * as data from '../helpers/data.json';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
  ) {}

  async getCategories(): Promise<Categories[]> {
    return this.categoriesRepository.find();
  }

  async addCategories(): Promise<string> {
    let categoriesAdded = 0;
    let categoriesAlreadyExist = 0;

    for (const element of data) {
      const categoryExists = await this.categoriesRepository.findOne({
        where: { name: element.category },
      });

      if (!categoryExists) {
        const newCategory = this.categoriesRepository.create({
          name: element.category,
        });
        await this.categoriesRepository.save(newCategory);
        categoriesAdded++;
      } else {
        categoriesAlreadyExist++;
      }
    }

    if (categoriesAdded > 0) {
      return `${categoriesAdded} categorías agregadas exitosamente.`;
    } else if (categoriesAlreadyExist > 0) {
      return 'Todas las categorías ya están cargadas.';
    } else {
      return 'No se agregaron categorías.';
    }
  }
}
