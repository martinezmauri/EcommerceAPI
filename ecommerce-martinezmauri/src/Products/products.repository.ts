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
      relations: ['categories'], // orderDetails?
    });
  }
  async getProductById(id: string): Promise<Product> {
    return await this.productRepository.findOne({
      where: { id },
      relations: ['categories'],
    });
  }
  async addProducts(): Promise<string> {
    // caso en que necesite cargar un producto.
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

  async createProduct(createProduct: CreateProductDto): Promise<Product> {
    const { name, description, price, stock, imgUrl, categoryName } =
      createProduct;

    const category = await this.categoriesRepository.findOne({
      where: { name: categoryName },
    });
    if (!category) {
      throw new NotFoundException(`Categoría ${categoryName} no encontrada.`);
    }
    const newProduct = await this.productRepository.create({
      name,
      description,
      price,
      stock,
      imgUrl,
      categories: category,
    });
    return await this.productRepository.save(newProduct);
  }

  async updateProductById(
    id: string,
    newProduct: Partial<Product>,
  ): Promise<Partial<Product>> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`El producto con ID ${id} no encontrado`);
    }
    const updateProduct = await this.productRepository.save({
      ...product,
      ...newProduct,
    });
    return updateProduct;
  }

  async deleteProductById(id: string): Promise<string> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`El producto con ID ${id} no encontrado.`);
    }
    await this.productRepository.delete({ id });
    return `Producto con ID ${id} eliminado`;
  }
}
