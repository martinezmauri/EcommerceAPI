import { UsersRepository } from './users.repository';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './User.entity';
import { afterEach } from 'node:test';
import * as bcrypt from 'bcrypt';

const mockUserRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  merge: jest.fn(),
  delete: jest.fn(),
};
const mockUser = {
  id: 'valid-id',
  name: 'test',
  email: 'test@mail.com',
  password: 'test1234',
  phone: 123456789,
  country: 'test',
  address: 'test',
  city: 'test',
  isAdmin: false,
};

describe('userRepository', () => {
  let userRepository: UsersRepository;
  let userRepo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();
    userRepository = module.get<UsersRepository>(UsersRepository);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('create instance of userRepository', async () => {
    expect(userRepository).toBeDefined();
  });
  it('getUsers() should return an array of users hiding the password ', async () => {
    mockUserRepository.find.mockResolvedValue([mockUser]);
    const users = await userRepository.getUsers();

    expect(users).toBeInstanceOf(Array);
    expect(users[0]).toEqual({
      id: 'valid-id',
      name: 'test',
      email: 'test@mail.com',
      phone: 123456789,
      country: 'test',
      address: 'test',
      city: 'test',
      isAdmin: false,
    });
    expect(mockUserRepository.find).toHaveBeenCalledTimes(1);
  });
  it('getUserById() should throw an error if the user not found', async () => {
    mockUserRepository.findOne.mockResolvedValue(null);
    try {
      await userRepository.getUserById('invalid-id');
    } catch (error) {
      expect(error.message).toEqual('El usuario no existe.');
      expect(error.status).toBe(404);
    }
  });
  it('getUserById() should return a user by id hiding the password and role', async () => {
    mockUserRepository.findOne.mockResolvedValue(mockUser);
    const user = await userRepository.getUserById('valid-id');

    expect(user).toBeInstanceOf(Object);
    expect(user).toEqual({
      id: 'valid-id',
      name: 'test',
      email: 'test@mail.com',
      phone: 123456789,
      country: 'test',
      address: 'test',
      city: 'test',
    });
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { id: mockUser.id },
    });
  });
  it('findUserByEmail should return a user by email', async () => {
    mockUserRepository.findOne.mockResolvedValue(mockUser);
    const user = await userRepository.findUserByEmail('test@mail.com');

    expect(user).toBeInstanceOf(Object);
    expect(user).toEqual(mockUser);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { email: mockUser.email },
    });
  });
  it('createUser() should create one user and return it', async () => {
    mockUserRepository.save.mockResolvedValue(mockUser);

    const user = await userRepository.createUser(mockUser);

    expect(user).toBeInstanceOf(Object);
    expect(user).toEqual(mockUser);
    expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
  });
  it('updateUserById() should return an error if the user is not found', async () => {
    mockUserRepository.findOne.mockResolvedValue(null);
    try {
      await userRepository.updateUserById('invalid-id', {
        password: 'test321',
      });
    } catch (error) {
      expect(error.message).toEqual('El usuario no existe.');
      expect(error.status).toBe(404);
    }
  });
  it('updateUserById() should return an error if the password cannot be encrypted', async () => {
    mockUserRepository.findOne.mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue(null);
    try {
      await userRepository.updateUserById('invalid-id', {
        password: 'test321',
      });
    } catch (error) {
      expect(error.message).toEqual('Error interno al hashear');
      expect(error.status).toBe(400);
    }
  });
  it('updatedUserById() should return the updated user hiding their password', async () => {
    mockUserRepository.findOne.mockResolvedValue(mockUser);

    const hashedPassword = 'hashedPassword123';
    jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);

    mockUserRepository.merge.mockReturnValue({
      ...mockUser,
      password: hashedPassword,
    });

    mockUserRepository.save.mockResolvedValue({
      ...mockUser,
      password: hashedPassword,
    });

    const user = await userRepository.updateUserById('valid-id', {
      password: 'asd123',
    });

    expect(user.password).not.toBeDefined();
    expect(bcrypt.hash).toHaveBeenCalledWith('asd123', 10);
    expect(user).toEqual({
      id: 'valid-id',
      name: 'test',
      email: 'test@mail.com',
      phone: 123456789,
      country: 'test',
      address: 'test',
      city: 'test',
      isAdmin: false,
    });
  });

  it('deleteUserById() should return an error if the number of affected rows is 0 ', async () => {
    mockUserRepository.delete.mockResolvedValue({ result: 0 });
    try {
      await userRepository.deleteUserById('valid-id');
    } catch (error) {
      expect(error.message).toEqual('El usuario no existe.');
    }
  });
  it('deleteUserById() should return an message if the user was deleted', async () => {
    mockUserRepository.delete.mockResolvedValue({ result: 1 });
    const result = await userRepository.deleteUserById('valid-id');
    expect(result).toEqual('Usuario con ID valid-id eliminado correctamente.');
    expect(mockUserRepository.delete).toHaveBeenCalledWith({ id: 'valid-id' });
  });
});
