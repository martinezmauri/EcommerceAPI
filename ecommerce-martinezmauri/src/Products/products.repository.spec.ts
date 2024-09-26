import { Repository } from 'typeorm';
import { ProductsRepository } from './products.repository';
import { Product } from './Product.entity';
import { Categories } from '../Categories/Categories.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProductDto } from 'src/dto/CreateProductDto';

const mockProductRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};
const mockCategoriesRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
};

jest.mock('../helpers/data.json', () => [
  {
    name: 'product1',
    category: 'category1',
    price: 100,
    description: 'desc',
    stock: 10,
  },
]);
describe('productRepository', () => {
  let productRepository: ProductsRepository;
  let productRepo: Repository<Product>;
  let categoriesRepo: Repository<Categories>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsRepository,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(Categories),
          useValue: mockCategoriesRepository,
        },
      ],
    }).compile();

    productRepository = module.get<ProductsRepository>(ProductsRepository);
    productRepo = module.get<Repository<Product>>(getRepositoryToken(Product));
    categoriesRepo = module.get<Repository<Categories>>(
      getRepositoryToken(Categories),
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('create a instance of productRepositoy', () => {
    expect(productRepository).toBeDefined();
  });

  it('getProducts() should return the products', async () => {
    const mockProducts = [
      { id: 1, name: 'product1' },
      { id: 2, name: 'product2' },
    ];
    mockProductRepository.find.mockResolvedValue(mockProducts);
    const result = await productRepository.getProducts();
    expect(result).toBe(mockProducts);
    expect(mockProductRepository.find).toHaveBeenCalledWith({
      relations: ['categories'],
    });
  });

  it('getProductById() should return a product if found', async () => {
    const mockProduct = { id: '123', name: 'product1' };

    mockProductRepository.findOne.mockResolvedValue(mockProduct);

    const result = await productRepository.getProductById('123');

    expect(result).toBe(mockProduct);
    expect(mockProductRepository.findOne).toHaveBeenCalledWith({
      where: { id: '123' },
      relations: ['categories'],
    });
  });

  it('getProductById() should return null if no product is found', async () => {
    mockProductRepository.findOne.mockResolvedValue(null);

    const result = await productRepository.getProductById('non-existent-id');

    expect(result).toBeNull();
    expect(mockProductRepository.findOne).toHaveBeenCalledWith({
      where: { id: 'non-existent-id' },
      relations: ['categories'],
    });
  });

  it('addProduct() Should throw an error if categories are not loaded', async () => {
    mockCategoriesRepository.find.mockResolvedValue([]);
    try {
      await productRepository.addProducts();
    } catch (error) {
      expect(error.message).toEqual('Primero debe cargar las categorías.');
      expect(error.status).toBe(400);
      expect(mockCategoriesRepository.find).toHaveBeenCalledTimes(1);
    }
  });

  it('addProduct() should add products when categories are loaded', async () => {
    mockCategoriesRepository.find.mockResolvedValue([{ name: 'category1' }]);

    mockProductRepository.create.mockImplementation((product) => product);
    mockProductRepository.save.mockResolvedValue(null);

    const result = await productRepository.addProducts();

    expect(result).toBe('Productos agregados.');
    expect(mockCategoriesRepository.find).toHaveBeenCalledTimes(1);

    expect(mockProductRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'product1',
        price: 100,
        description: 'desc',
        stock: 10,
        categories: expect.any(Object),
      }),
    );

    expect(mockProductRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'product1',
        price: 100,
        description: 'desc',
        stock: 10,
      }),
    );
  });
  it('createProduct() should throw error if the category not found', async () => {
    const mockProduct: CreateProductDto = {
      name: 'product-test',
      description: 'desc-test',
      price: 10,
      stock: 5,
      category_id: '6816105a-a56b-4eb6-bdaf-d2cf75277550',
    };
    mockCategoriesRepository.findOne.mockResolvedValue(null);
    try {
      await productRepository.createProduct(mockProduct);
    } catch (error) {
      expect(error.message).toEqual(
        `Categoría 6816105a-a56b-4eb6-bdaf-d2cf75277550 no encontrada.`,
      );
      expect(error.status).toBe(404);
      expect(mockCategoriesRepository.findOne).toHaveBeenCalledWith({
        where: { id: '6816105a-a56b-4eb6-bdaf-d2cf75277550' },
      });
    }
  });
  it('createProduct() should create a new product correctly', async () => {
    const mockProduct: CreateProductDto = {
      name: 'product-test',
      description: 'desc-test',
      price: 10,
      stock: 5,
      imgUrl: 'http://imagen-de-prueba.com',
      category_id: '6816105a-a56b-4eb6-bdaf-d2cf75277550',
    };
    const mockCategory = {
      id: 1,
      name: 'categoria 1',
    };
    jest
      .spyOn(mockCategoriesRepository, 'findOne')
      .mockResolvedValue(mockCategory);
    jest
      .spyOn(mockProductRepository, 'create')
      .mockReturnValue({ ...mockProduct, categories: mockCategory });
    jest.spyOn(mockProductRepository, 'save').mockResolvedValue({
      id: '123456-a56b-4eb6-bdaf-d2cf75277550',
      ...mockProduct,
      categories: mockCategory,
    });

    const result = await productRepository.createProduct(mockProduct);

    expect(mockCategoriesRepository.findOne).toHaveBeenCalledWith({
      where: {
        id: '6816105a-a56b-4eb6-bdaf-d2cf75277550',
      },
    });
    expect(mockProductRepository.create).toHaveBeenCalledWith({
      name: 'product-test',
      description: 'desc-test',
      price: 10,
      stock: 5,
      imgUrl: 'http://imagen-de-prueba.com',
      categories: mockCategory,
    });
    expect(mockProductRepository.save).toHaveBeenCalled();
    expect(result).toEqual('123456-a56b-4eb6-bdaf-d2cf75277550');
  });

  it('updateProductById() should throw a error if not exist product for id', async () => {
    mockProductRepository.findOneBy.mockResolvedValue(null);
    try {
      await productRepository.updateProductById('invalid-id', {
        name: 'product-test',
      });
    } catch (error) {
      expect(error.message).toEqual(
        `El producto con ID invalid-id no encontrado`,
      );
    }
  });

  it('updateProductById() should return a new product updated', async () => {
    const mockProduct = {
      id: '1',
      name: 'product-test',
      description: 'desc-test',
      price: 30,
      stock: 10,
      imgUrl: 'http://imagen-de-prueba.com',
      categories: { id: 1, name: 'category-test' },
    };
    const mockNewProduct = {
      name: 'product-new',
      description: 'desc-new',
      price: 50,
      stock: 2,
      imgUrl: 'http://imagen-de-prueba.com',
    };
    mockProductRepository.findOneBy.mockResolvedValue(mockProduct);
    mockProductRepository.save.mockResolvedValue({
      ...mockProduct,
      ...mockNewProduct,
    });

    const result = await productRepository.updateProductById(
      '1',
      mockNewProduct,
    );

    expect(result).toEqual('1');
    expect(mockProductRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
    expect(mockProductRepository.save).toHaveBeenCalledWith({
      ...mockProduct,
      ...mockNewProduct,
    });
  });
  it('deleteProductById() should throw a error if not exist product for id', async () => {
    mockProductRepository.findOneBy.mockResolvedValue(null);
    mockProductRepository.delete.mockResolvedValue({ affected: 0 });
    try {
      await productRepository.deleteProductById('invalid-id');
    } catch (error) {
      expect(error.message).toEqual(`El producto no existe.`);
    }
  });
  it('deleteProductById() should return id for the product deleted', async () => {
    const mockProduct = { id: 'valid-id', name: 'product-test' };
    mockProductRepository.findOneBy.mockResolvedValue(mockProduct);
    mockProductRepository.delete.mockResolvedValue({ affected: 1 });
    const result = await productRepository.deleteProductById('valid-id');
    expect(result).toEqual(`valid-id`);
  });
});
