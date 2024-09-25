import { Product } from '../Products/Product.entity';
import { FileUploadService } from './file-upload.service';
import { Repository } from 'typeorm';
import { FileUploadRepository } from './file-upload.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { buffer } from 'stream/consumers';

const mockProductRepository = {
  findOneBy: jest.fn(),
  update: jest.fn(),
};
const mockFileUploadRepository = {
  uploadImage: jest.fn(),
};
describe('file-uploadService() ', () => {
  let fileUploadService: FileUploadService;
  let productRepository: Repository<Product>;
  let fileUploadRepository: FileUploadRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileUploadService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: FileUploadRepository,
          useValue: mockFileUploadRepository,
        },
      ],
    }).compile();
    fileUploadService = module.get<FileUploadService>(FileUploadService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    fileUploadRepository =
      module.get<FileUploadRepository>(FileUploadRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Create an instance of fileUploadService', async () => {
    expect(fileUploadService).toBeDefined();
  });

  it('uploadProductImage() throw error if the product dont exist', async () => {
    mockProductRepository.findOneBy = jest.fn().mockResolvedValue(null);
    try {
      await fileUploadService.uploadProductImage(
        'id-inexistente',
        {} as Express.Multer.File,
      );
    } catch (error) {
      expect(error.message).toEqual(
        'No existe el producto al que quiere modificar',
      );
      expect(mockProductRepository.findOneBy).toHaveBeenCalledWith({
        id: 'id-inexistente',
      });
      expect(error.status).toBe(404);
    }
  });
  it('uploadProductImage() should upload an image and update product imageUrl', async () => {
    const mockFile = { buffer: Buffer.from('test') } as Express.Multer.File;
    const mockProduct = { id: '1', name: 'Test Product', imgUrl: null };

    mockProductRepository.findOneBy.mockResolvedValue(mockProduct);
    mockFileUploadRepository.uploadImage.mockResolvedValue({
      secure_url: 'mock-url',
    });
    mockProductRepository.update.mockResolvedValue(null);
    const updatedProduct = { ...mockProduct, imgUrl: 'mock-url' };
    mockProductRepository.findOneBy.mockResolvedValue(updatedProduct);

    const result = await fileUploadService.uploadProductImage('1', mockFile);

    expect(result.imgUrl).toBe('mock-url');
    expect(mockFileUploadRepository.uploadImage).toHaveBeenCalledWith(mockFile);
    expect(result).toEqual(updatedProduct);
  });
});
