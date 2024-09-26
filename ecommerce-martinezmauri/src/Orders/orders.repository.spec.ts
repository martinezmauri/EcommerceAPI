import { In, MoreThan, Repository } from 'typeorm';
import { OrdersRepository } from './orders.repository';
import { Product } from '../Products/Product.entity';
import { User } from '../Users/User.entity';
import { Orders } from './Orders.entity';
import { OrderDetails } from '../OrderDetails/OrderDetails.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockUserRepository = {
  findOne: jest.fn(),
};
const mockOrdersRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
};
const mockOrderDetailsRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
};

const mockProductRepository = {
  findOneBy: jest.fn(),
  save: jest.fn(),
  findBy: jest.fn(),
};
describe('ordersRepository', () => {
  let ordersRepository: OrdersRepository;
  let ordersRepo: Repository<Orders>;
  let userRepo: Repository<User>;
  let productRepo: Repository<Product>;
  let ordersDetailRepo: Repository<OrderDetails>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersRepository,
        { provide: getRepositoryToken(Orders), useValue: mockOrdersRepository },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(OrderDetails),
          useValue: mockOrderDetailsRepository,
        },
      ],
    }).compile();

    ordersRepository = module.get<OrdersRepository>(OrdersRepository);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    productRepo = module.get<Repository<Product>>(getRepositoryToken(Product));
    ordersDetailRepo = module.get<Repository<OrderDetails>>(
      getRepositoryToken(OrderDetails),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Create an instance of ordersRepository', async () => {
    expect(ordersRepository).toBeDefined();
  });

  it('getOrder() throw error if the order id is invalid', async () => {
    mockOrdersRepository.findOne.mockResolvedValue(null);
    try {
      await ordersRepository.getOrder('invalid-id');
    } catch (error) {
      expect(error.message).toEqual('No existe una order para ese id.');
      expect(error.status).toBe(404);
      expect(mockOrdersRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'invalid-id' },
        relations: ['user'],
      });
    }
  });

  it('getOrder() throw error if detail order not found ', async () => {
    const mockOrder = {
      id: 'valid-id',
      date: new Date(),
    };

    mockOrdersRepository.findOne.mockResolvedValue(mockOrder);
    mockOrderDetailsRepository.findOne.mockResolvedValue(null);
    try {
      await ordersRepository.getOrder('valid-id');
    } catch (error) {
      expect(error.message).toEqual('No existe un detalle para la orden.');
      expect(error.status).toBe(404);
      expect(mockOrdersRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'valid-id' },
        relations: ['user'],
      });
      expect(mockOrderDetailsRepository.findOne).toHaveBeenCalledWith({
        where: { order: mockOrder },
        relations: ['products'],
      });
    }
  });

  it('getOrder() returns a valid order', async () => {
    const mockOrder = {
      id: 'valid-id',
      date: new Date(),
      user: {
        id: 'valid-id',
        name: 'test-user',
      },
    };
    const mockOrderDetail = {
      id: 'valid-id',
      price: 20,
      products: [
        { name: 'test', price: 10 },
        { name: 'test', price: 10 },
      ],
    };

    mockOrdersRepository.findOne.mockResolvedValue(mockOrder);
    mockOrderDetailsRepository.findOne.mockResolvedValue(mockOrderDetail);

    const result = await ordersRepository.getOrder('valid-id');

    expect(result.order.user).toEqual(mockOrder.user);
    expect(result.order).toEqual(mockOrder);
    expect(result.orderDetail).toEqual({
      id: mockOrderDetail.id,
      price: mockOrderDetail.price,
      products: mockOrderDetail.products,
    });
    expect(mockOrdersRepository.findOne).toHaveBeenCalledWith({
      where: { id: 'valid-id' },
      relations: ['user'],
    });
    expect(mockOrderDetailsRepository.findOne).toHaveBeenCalledWith({
      where: { order: mockOrder },
      relations: ['products'],
    });
  });

  it('addOrder() throws an error if a user does not exist for the id', async () => {
    mockUserRepository.findOne.mockResolvedValue(null);
    try {
      await ordersRepository.addOrder('invalid-id', ['test1', 'test2']);
    } catch (error) {
      expect(error.message).toEqual('user con id invalid-id no existe.');
      expect(error.status).toBe(404);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'invalid-id' },
      });
    }
  });

  it('addOrder() Throws an error if the product stock is not greater than 0', async () => {
    const mockUser = {
      id: 'valid-id',
    };
    mockUserRepository.findOne.mockResolvedValue(mockUser);
    mockProductRepository.findBy.mockResolvedValue([]);
    try {
      await ordersRepository.addOrder('valid-id', ['test1', 'test2']);
    } catch (error) {
      expect(error.message).toEqual('No hay productos con stock mayor a 0');
      expect(error.status).toBe(404);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(mockProductRepository.findBy).toHaveBeenCalledWith({
        id: In(['test1', 'test2']),
        stock: MoreThan(0),
      });
    }
  });

  it('addOrder() throw an error if the product contain price invalid', async () => {
    const mockUser = {
      id: 'valid-id',
    };
    const mockProduct = [{ id: 1, price: 'invalid-price' }];
    mockUserRepository.findOne.mockResolvedValue(mockUser);
    mockProductRepository.findBy.mockResolvedValue(mockProduct);
    try {
      await ordersRepository.addOrder('valid-id', ['test1']);
    } catch (error) {
      expect(error.message).toEqual('El producto tiene un precio invalido');
      expect(error.status).toBe(400);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(mockProductRepository.findBy).toHaveBeenCalledWith({
        id: In(['test1']),
        stock: MoreThan(0),
      });
    }
  });

  it('addOrder() continue if price is a string', () => {
    const mockUser = {
      id: 'valid-id',
    };
    const mockProduct = [{ id: 1, price: '10' }];
    mockUserRepository.findOne.mockResolvedValue(mockUser);
    mockProductRepository.findBy.mockResolvedValue(mockProduct);
  });

  it('addOrder() updates product stock after order is placed', async () => {
    const mockUser = {
      id: 'valid-id',
    };
    const mockProduct = [
      { id: 'test1', price: 10, stock: 5 },
      { id: 'test2', price: 15, stock: 3 },
    ];
    const mockSavedOrder = { id: 'order-id', date: new Date(), user: mockUser };
    const mockSavedOrderDetail = {
      id: 'order-detail-id',
      price: 25,
      product: mockProduct,
    };

    mockUserRepository.findOne.mockResolvedValue(mockUser);
    mockProductRepository.findBy.mockResolvedValue(mockProduct);
    mockOrdersRepository.save.mockResolvedValue(mockSavedOrder);
    mockOrderDetailsRepository.save.mockResolvedValue(mockSavedOrderDetail);

    const result = await ordersRepository.addOrder('valid-id', [
      'test1',
      'test2',
    ]);
    expect(mockOrderDetailsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        price: 25,
        products: mockProduct,
      }),
    );
    expect(result.orderDetail.price).toBe(25);
  });

  it('addOrder() correctly calculates total price for valid products', async () => {
    const mockUser = { id: 'valid-id' };
    const mockProducts = [
      { id: 'test1', price: 10, stock: 5 },
      { id: 'test2', price: 20, stock: 3 },
    ];
    mockUserRepository.findOne.mockResolvedValue(mockUser);
    mockProductRepository.findBy.mockResolvedValue(mockProducts);

    const result = await ordersRepository.addOrder('valid-id', [
      'test1',
      'test2',
    ]);
    expect(result.orderDetail.price).toBe(30);
    expect(result.orderDetail.products).toHaveLength(2);
  });
});
