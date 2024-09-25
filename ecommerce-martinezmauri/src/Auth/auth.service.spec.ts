import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { User } from '../Users/User.entity';
import { UsersRepository } from '../Users/users.repository';
import { CreateUserDto } from '../dto/CreateUserDto';
import * as bcrypt from 'bcrypt';

describe('AuthService() ', () => {
  let authService: AuthService;
  let mockUserRepository: Partial<UsersRepository>;

  const mockUser: CreateUserDto = {
    name: 'Mauricio',
    email: 'mauri@example.com',
    password: '1234Mauri_',
    confirmPassword: '1234Mauri_',
    isAdmin: false,
    address: 'Direccion inventada 123',
    city: 'Ciudad inventada',
    country: 'Argentina',
    phone: 12345678,
  };
  beforeEach(async () => {
    mockUserRepository = {
      findUserByEmail: () => Promise.resolve(undefined),
      createUser: (user: Omit<User, 'id'>): Promise<User> =>
        Promise.resolve({
          ...user,
          isAdmin: false,
          id: '1234fs-234sd-24csfd-34sdfg',
        }),
    };
    const module = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'testSecretKey',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [
        AuthService,
        { provide: UsersRepository, useValue: mockUserRepository },
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
  });

  it('Create an instance of AuthService', async () => {
    expect(authService).toBeDefined();
  });

  it('singIn() throw an error if the password is incorrect', async () => {
    mockUserRepository.findUserByEmail = jest.fn().mockResolvedValue({
      ...mockUser,
      password: await bcrypt.hash('correctPassword', 10),
    });
    try {
      await authService.signIn(mockUser.email, 'badPassword');
    } catch (error) {
      expect(error.message).toEqual('Usuario y/o contraseña incorrecta');
      expect(error.status).toBe(400);
    }
  });

  it('singIn() throw an error if the email is incorrect', async () => {
    mockUserRepository.findUserByEmail = jest.fn().mockResolvedValue(undefined);
    try {
      await authService.signIn('emailIncorrect@example.com', mockUser.password);
    } catch (error) {
      expect(error.message).toEqual('Usuario y/o contraseña incorrecta');
      expect(error.status).toBe(400);
    }
  });

  it('singIn() return a token if credentials are valid', async () => {
    mockUserRepository.findUserByEmail = jest.fn().mockResolvedValue({
      ...mockUser,
      password: await bcrypt.hash(mockUser.password, 10),
    });

    const result = await authService.signIn(mockUser.email, mockUser.password);
    expect(result).toHaveProperty('token');
    expect(result.success).toEqual('user logged in successfully');
  });

  // SIGNUP()

  it('signUp() create a new user', async () => {
    const user = await authService.signUp(mockUser);
    expect(user).toBeDefined();
  });

  it('singUp() throw an error if the email already exists ', async () => {
    mockUserRepository.findUserByEmail = jest
      .fn()
      .mockResolvedValue({ ...mockUser });
    try {
      await authService.signUp(mockUser);
    } catch (error) {
      expect(error.message).toEqual('Su correo ya tiene una cuenta creada.');
      expect(error.status).toBe(400);
    }
  });

  it('singUp() throw an error if the passwords do not match', async () => {
    try {
      await authService.signUp({ ...mockUser, confirmPassword: '1234' });
    } catch (error) {
      expect(error.message).toEqual('Las contraseñas no coinciden.');
      expect(error.status).toBe(400);
    }
  });

  it('singUp() throw an error if password hashing fail', async () => {
    jest.spyOn(bcrypt, 'hash').mockResolvedValue(null);
    try {
      await authService.signUp(mockUser);
    } catch (error) {
      expect(error.message).toEqual('Error interno.');
      expect(error.status).toBe(400);
    }
  });

  it('singUp() check if the password was removed in the response', async () => {
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
    const user = await authService.signUp(mockUser);
    expect(user).toBeDefined();
    expect(user).not.toHaveProperty('password');
    expect(user.password).toBeUndefined();
  });

  it('singUp() should continue if email is not found', async () => {
    mockUserRepository.findUserByEmail = jest.fn().mockResolvedValue(null);

    const user = await authService.signUp(mockUser);
    expect(user).toBeDefined();
  });
});
