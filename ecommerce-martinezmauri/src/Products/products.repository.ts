import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './Product.entity';
import { Repository } from 'typeorm';
import * as data from '../helpers/data.json';
import { Categories } from '../Categories/Categories.entity';
import { CreateProductDto } from '../dto/CreateProductDto';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
  ) {}

  async getProducts(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ['categories'],
    });
  }
  async getProductById(id: string): Promise<Product> {
    return await this.productRepository.findOne({
      where: { id },
      relations: ['categories'],
    });
  }
  async addProducts(): Promise<string> {
    const categories = await this.categoriesRepository.find();
    if (categories.length === 0) {
      throw new BadRequestException('Primero debe cargar las categorías.');
    }

    for (const element of data) {
      const existingProduct = await this.productRepository.findOne({
        where: { name: element.name },
      });
      if (existingProduct) {
        throw new ConflictException(`Los productos ya se encuentran cargados.`);
      }
      const product = new Product();
      product.name = element.name;
      product.price = element.price;
      product.description = element.description;
      product.stock = element.stock;

      const category = categories.find((cat) => cat.name === element.category);
      if (category) {
        product.categories = category;
      } else {
        throw new NotFoundException(
          `Categoría ${element.category} no encontrada.`,
        );
      }
      const newProduct = this.productRepository.create(product);
      await this.productRepository.save(newProduct);
    }
    return 'Productos agregados.';
  }

  async createProduct(createProduct: CreateProductDto): Promise<string> {
    const { name, description, price, stock, imgUrl, category_id } =
      createProduct;

    const category = await this.categoriesRepository.findOne({
      where: { id: category_id },
    });
    if (!category) {
      throw new NotFoundException(`Categoría ${category_id} no encontrada.`);
    }
    const newProduct = await this.productRepository.create({
      name,
      description,
      price,
      stock,
      imgUrl,
      categories: category,
    });
    const savedProduct = await this.productRepository.save(newProduct);
    return savedProduct.id;
  }

  async updateProductById(
    id: string,
    newProduct: Partial<Product>,
  ): Promise<string> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`El producto con ID ${id} no encontrado`);
    }
    const updateProduct = await this.productRepository.save({
      ...product,
      ...newProduct,
    });
    return updateProduct.id;
  }

  async deleteProductById(id: string): Promise<string> {
    const product = await this.productRepository.delete({ id });
    if (product.affected === 0) {
      throw new NotFoundException(`El producto no existe.`);
    }
    return id;
  }
}
