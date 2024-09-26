import { Repository } from 'typeorm';
import { CategoriesRepository } from './categories.repository';
import { Categories } from './Categories.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as data from '../helpers/data.json';

const mockCategoriesRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};
describe('CategoriesRepository', () => {
  let categoriesRepository: CategoriesRepository;
  let categoriesRepo: Repository<Categories>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesRepository,
        {
          provide: getRepositoryToken(Categories),
          useValue: mockCategoriesRepository,
        },
      ],
    }).compile();

    categoriesRepository =
      module.get<CategoriesRepository>(CategoriesRepository);
    categoriesRepo = module.get<Repository<Categories>>(
      getRepositoryToken(Categories),
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getCategories() should return all categories', async () => {
    const mockCategories = [
      { id: 1, name: 'Electronics' },
      { id: 2, name: 'Books' },
    ];
    mockCategoriesRepository.find.mockResolvedValue(mockCategories);
    const result = await categoriesRepository.getCategories();

    expect(result).toEqual(mockCategories);
    expect(mockCategoriesRepository.find).toHaveBeenCalledTimes(1);
  });

  it('getCategories() throws a message if the categories have already been loaded', async () => {
    const mockCategory = { name: 'Electronics' };
    mockCategoriesRepository.findOne.mockResolvedValue(mockCategory);

    const result = await categoriesRepository.addCategories();

    expect(result).toEqual('Todas las categorías ya están cargadas.');
  });

  it('getCategories() should add categories if they do not exist', async () => {
    mockCategoriesRepository.findOne.mockResolvedValue(null);
    mockCategoriesRepository.create.mockReturnValue({ name: data[0].category });
    mockCategoriesRepository.save.mockResolvedValue({ name: data[0].category });

    const result = await categoriesRepository.addCategories();

    expect(result).toBe('12 categorías agregadas exitosamente.');
    expect(mockCategoriesRepository.create).toHaveBeenCalledWith({
      name: data[0].category,
    });
    expect(mockCategoriesRepository.save).toHaveBeenCalledWith({
      name: data[0].category,
    });
  });
});
