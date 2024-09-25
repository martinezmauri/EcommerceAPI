import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Product } from './Product.entity';
import { CreateProductDto } from '../dto/CreateProductDto';

@Injectable()
export class ProductsService {
  constructor(private productRepository: ProductsRepository) {}

  async getProducts(limit: number, page: number): Promise<Product[]> {
    const start = (page - 1) * limit;
    const end = start + limit;
    const products = await this.productRepository.getProducts();
    return products.slice(start, end);
  }
  async getProductById(id: string): Promise<Product> {
    const user = await this.productRepository.getProductById(id);
    if (!user) {
      throw new NotFoundException('No existe un usuario para ese id.');
    }
    return user;
  }
  async addProducts(): Promise<string> {
    return await this.productRepository.addProducts();
  }
  async createProduct(product: CreateProductDto): Promise<string> {
    return await this.productRepository.createProduct(product);
  }
  async updateProductById(
    id: string,
    newProduct: Partial<Product>,
  ): Promise<string> {
    return await this.productRepository.updateProductById(id, newProduct);
  }
  async deleteProductById(id: string): Promise<string> {
    return await this.productRepository.deleteProductById(id);
  }
}
