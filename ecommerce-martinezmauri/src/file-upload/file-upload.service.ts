import { Injectable, NotFoundException } from '@nestjs/common';
import { FileUploadRepository } from './file-upload.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../Products/Product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly fileUploadRepository: FileUploadRepository,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async uploadProductImage(
    id: string,
    file: Express.Multer.File,
  ): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(
        'No existe el producto al que quiere modificar',
      );
    }
    const uploadedImage = await this.fileUploadRepository.uploadImage(file);
    await this.productRepository.update(id, {
      imgUrl: uploadedImage.secure_url,
    });
    const updatedProduct = await this.productRepository.findOneBy({ id });
    return updatedProduct;
  }
}
